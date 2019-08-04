import {ContentService} from "../ContentService";
import {RequestResult} from "../../model/dto/RequestResult";
import {Content} from "../../model/bo/Content";
import {ContentDao} from "../../dao/ContentDao/ContentDao";
import {ContentDaoImpl} from "../../dao/ContentDao/impl/ContentDaoImpl";
import {isUndef} from "../../utils/typeUtils";
import {DirectoryOperate} from "../../dao/DirectoryOperate";
import {StatEnum} from "../../enums/StatEnum";

export class ContentServiceImpl implements ContentService {
  contentDao: ContentDao;
  directoryOperate: DirectoryOperate;

  constructor() {
    this.contentDao = new ContentDaoImpl();
    this.directoryOperate = new DirectoryOperate()
  }

  async addContent(content: Content): Promise<RequestResult> {
    let bashPath = await this.getPath(content);
    let targetContent: any = await this.contentDao.searchChildContent(content);

    if (targetContent.length) {
      return new RequestResult(500, '目标目录已经存在', content);
    }

    // 进行创建文件夹
    let resultMsg: StatEnum = await this.directoryOperate.createDir(bashPath + content.name);
    if (resultMsg == StatEnum.SUCCESS) {
      let status = this.contentDao.addContent(content);
      if (status) {
        return new RequestResult(200, '创建文件夹成功', content);
      } else {
        return new RequestResult(500, '写入数据库失败', content);  // TODO 此时要进行文件的删除
      }
    }
    return new RequestResult(500, resultMsg, content);
  }

  /**
   * @description 在服务器上面删除目录
   * @param content
   */
  async deleteContent(content: Content): Promise<RequestResult> {
    let dataResult: any = await this.contentDao.searchContent(content);

    if (dataResult.length) {
      let path = await this.getPath(content);

      if (!path.length) {
        return new RequestResult(500, StatEnum.DELETE_PATH_IS_NOT_EXIST, content);
      }

      let status: StatEnum = await this.directoryOperate.deleteDir(path);
      if (status == StatEnum.SUCCESS) {
        return new RequestResult(200, status, content)
      }
      return new RequestResult(500, status, content);
    }

    return new RequestResult(500, StatEnum.DATA_READ_FAIL, content);
  }

  async renameContent(content: Content): Promise<RequestResult> {
    return undefined;
  }

  async searchAllChildContent(content: Content): Promise<RequestResult> {
    return undefined;
  }

  async getPath(content: Content): Promise<string> {
    let pathArr: Array<string> = [],
        parentContent: Content = new Content();

    let result: any = await this.contentDao.searchContent(content);
    if (!result.length) {
      return '';
    }

    pathArr.push(result.name);

    while (!isUndef(result[0].parentid)) {
      parentContent.id = result[0].parentid;
      result = await this.contentDao.searchContent(parentContent);
      console.log(result)
      if (!result.length) {
        throw new Error(StatEnum.DIR_AND_DATABASE_IS_NOT_SYNC);
      }
      pathArr.push(result.name);
    }

    return pathArr.reverse().join('/');
  }
}