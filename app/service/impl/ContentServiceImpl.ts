import {ContentService} from "../ContentService";
import {RequestResult} from "../../model/dto/RequestResult";
import {Content} from "../../model/bo/Content";
import {ContentDao} from "../../dao/ContentDao/ContentDao";
import {ContentDaoImpl} from "../../dao/ContentDao/impl/ContentDaoImpl";
import {isUndef} from "../../utils/typeUtils";
import {DirectoryOperate} from "../../dao/DirectoryOperate";

export class ContentServiceImpl implements ContentService {
  contentDao: ContentDao;

  constructor() {
    this.contentDao = new ContentDaoImpl();
  }

  async addContent(content: Content): Promise<RequestResult> {
    let bashPath = await this.getBasePath(content);
    let targetContent: any = await this.contentDao.searchChildContent(content);

    if (targetContent.length) {
      return new RequestResult(500, '目标目录已经存在', content);
    }

    let directoryOperate: DirectoryOperate = new DirectoryOperate(bashPath),
        isExist = await DirectoryOperate.getStat(bashPath + content.name);

    if (isExist && isExist.directory()) {
      return new RequestResult(500, '目标目录已经存在', content);
    } else if (isExist) {
      return new RequestResult(500, '名字不能与文件重名', content);
    }

    // 进行创建文件夹
    let isSuccess: boolean = await directoryOperate.createDir(bashPath + content.name);
    if (isSuccess) {
      return new RequestResult(200, '文件夹创建成功', content);
    }
    return new RequestResult(500, '文件夹创建失败', content);
  }

  async deleteContent(content: Content): Promise<RequestResult> {
    return undefined;
  }

  async renameContent(content: Content): Promise<RequestResult> {
    return undefined;
  }

  async searchAllChildContent(content: Content): Promise<RequestResult> {
    return undefined;
  }

  async getBasePath(content: Content): Promise<string> {
    let pathArr: Array<string> = [];

    let contentDao: ContentDao = new ContentDaoImpl();

    let result: any = await contentDao.searchContent(content);
    if (!result.length) {
      return '';
    }
    pathArr.push(result.name);
    while (isUndef(result[0].parentId)) {
      content.id = result[0].parentId;
      result = await contentDao.searchContent(content);
      if (!result.length) {
        throw new Error('数据库发生错误')
      }
      pathArr.push(result.name);
    }

    return pathArr.reverse().join('/');
  }
}