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
    let parent: Content = new Content();
    parent.id = content.parentId;
    parent.ownerId = content.ownerId;
    let parentList = await this.contentDao.searchContent(parent)
    if (parent.id != null && !parentList.length) {
      return new RequestResult(500, '父容器不存在', parent)
    }
    let targetContent: any = await this.contentDao.searchChildContent(content);

    if (targetContent.length) {
      return new RequestResult(500, '目标目录已经存在', content);
    }

    // 进行创建文件夹

    let bashPath = await this.getPath(parent);
    let resultMsg: StatEnum = await this.directoryOperate.createDir(bashPath + '/' + content.name);
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
    let dataResultList: any = await this.contentDao.searchContent(content);

    if (dataResultList.length) {
      let path = await this.getPath(content);

      if (!path.length) {
        return new RequestResult(500, StatEnum.DELETE_PATH_IS_NOT_EXIST, content);
      }

      let status: StatEnum = await this.directoryOperate.deleteDir(path);
      if (status == StatEnum.SUCCESS) {
        let childList: any = await this.contentDao.searchChildrenListById(content),
            tempLen,
            i = 0;
        tempLen = -1;
        while(tempLen !== childList.length) {
          tempLen = childList.length;
          for (; i < tempLen; i++) {
            content.id = childList[i].id
            childList = [...childList, ...await this.contentDao.searchChildrenListById(content)];
          }
        }

        dataResultList = [...dataResultList, ...childList]

        let result = await this.contentDao.removeContent(dataResultList);
        if (!result) {
          return new RequestResult(500, StatEnum.DATA_UNKNOW_ERROR, content)
        }
        return new RequestResult(200, status, content);
      }
      return new RequestResult(500, status, content);
    }

    return new RequestResult(500, StatEnum.DATA_READ_FAIL, content);
  }

  async renameContent(content: Content): Promise<RequestResult> {
    let path = await this.getPath(content);

    if (!path.length) {
      return new RequestResult(500, StatEnum.DELETE_PATH_IS_NOT_EXIST, content);
    }

    let status: StatEnum = await this.directoryOperate.renameDir(content.name, path);

    if (status == StatEnum.SUCCESS) {
      let result = await this.contentDao.changeContent(content);
      if (result) {
        return new RequestResult(200, StatEnum.SUCCESS, {});
      }
      return new RequestResult(500, StatEnum.FAIL, {});
    }

    return new RequestResult(500, status, {});
  }

  async searchAllChildContent(content: Content): Promise<RequestResult> {
    let resultArr = await this.contentDao.searchChildrenListById(content);
    let contentList: Array<any> = [], len = resultArr.length;

    while(len--) {
      contentList.push({
        name: resultArr[len].name,
        id: resultArr[len].id
      })
    }
    return new RequestResult(200, StatEnum.SUCCESS, {
      ownerId: content.ownerId,
      childContentList: contentList
    });
  }

  async getPath(content: Content): Promise<string> {
    let pathArr: Array<string> = [],
        parentContent: Content = new Content();

    let result: any = await this.contentDao.searchContent(content);
    if (!result.length) {
      return '';
    }

    pathArr.push(result[0].name);

    while (!isUndef(result[0].parentid)) {
      parentContent.id = result[0].parentid;
      result = await this.contentDao.searchContent(parentContent);

      if (!result.length) {
        throw new Error(StatEnum.DIR_AND_DATABASE_IS_NOT_SYNC);
      }
      pathArr.push(result[0].name);
    }

    return pathArr.reverse().join('/');
  }
}