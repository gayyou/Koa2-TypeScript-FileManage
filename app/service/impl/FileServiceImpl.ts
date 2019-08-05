import {FileService} from "../FileService";
import {RequestResult} from "../../model/dto/RequestResult";
import {File} from '../../model/bo/File'
import {User} from "../../model/bo/User";
import {FileDaoImpl} from "../../dao/FileDao/impl/FileDaoImpl";
import {FileDao} from "../../dao/FileDao/FileDao";
import {Content} from "../../model/bo/Content";
import {FileOperate} from "../../dao/FileOperate";
import {ContentServiceImpl} from "./ContentServiceImpl";
import {StatEnum} from "../../enums/StatEnum";
import {ContentDao} from "../../dao/ContentDao/ContentDao";
import {ContentDaoImpl} from "../../dao/ContentDao/impl/ContentDaoImpl";

export class FileServiceImpl implements FileService {
  fileDao: FileDao;
  fileOperate: FileOperate;

  constructor() {
    this.fileDao = new FileDaoImpl();
    this.fileOperate = new FileOperate();
  }

  async addFile(file: File): Promise<RequestResult> {
    // 获取文件的基础路径
    let basePath: string = await this.getBasePath(file),
        fileOperate: FileOperate = new FileOperate();

    file.contentPath = basePath;
    file.url = basePath + '/' + file.name;

    // 查询数据库中是否存在该文件
    let fileList: any = await this.fileDao.searchFile(file);

    if (fileList.length) {
      let result: any = await fileOperate.searchFile(file);
      // 如果数据库中存在该条数据
      if (result && result.isFile) {
        return new RequestResult(500, '已经存在目标文件了，请勿重复创建文件', file);
      } else if (result) {
        return new RequestResult(500, '目标文件是一个文件夹', file);
      }
      throw  new Error('发生了数据库和文件系统的信息不一致问题');
    }

    if (fileOperate.writeFile(file)) {
      let databaseAdd: any = await this.fileDao.addFile(file);
      if (databaseAdd) {
        return new RequestResult(200, '创建文件成功', file)
      }
      return new RequestResult(500, '创建文件失败', file);
    }
    return new RequestResult(500, '创建文件失败，并且数据库发生了未知错误', file);
  }

  async changeFileName(file: File): Promise<RequestResult> {
    let fileOperate: FileOperate = new FileOperate();
    let databaseFile = await this.fileDao.searchFileById(file);

    if (!databaseFile.length) {
      return new RequestResult(500, StatEnum.FAIL, {});
    }

    file.contentId = databaseFile[0].parentid;
    let targetBashPath = await this.getBasePath(file);


    file.url = targetBashPath + '/' + databaseFile[0].name;

    let result: StatEnum = await fileOperate.renameFile('/' + file.name, file);
    if (result == StatEnum.SUCCESS) {
      await this.fileDao.changeFileName(file);
      return new RequestResult(200, result, file);
    }
    return new RequestResult(500, result, {});
  }

  async removeFile(file: File): Promise<RequestResult> {
    let isExist: any = await this.fileDao.searchFileById(file);
    if (!isExist.length) {
      return new RequestResult(500, StatEnum.FILE_IS_NOT_EXIST, file);
    }

    file.contentId = isExist[0].parentid;
    let targetBashPath = await this.getBasePath(file);
    file.url = targetBashPath + '/' + isExist[0].name;

    let removeStatus: StatEnum = await this.fileOperate.deleteFile(file);

    if (removeStatus == StatEnum.SUCCESS) {
      let isRemove = await this.fileDao.removeFile([file]);
      if (isRemove) {
        return new RequestResult(200, StatEnum.SUCCESS, {});
      }
      return new RequestResult(500, StatEnum.FAIL, {})
    }
    return new RequestResult(500, removeStatus, {});
  }

  async searchContentAllFiles(content: Content): Promise<RequestResult> {
    let resultArr: Array<any> = await this.fileDao.searchChildrenFile(content);

    return new RequestResult(200, StatEnum.SUCCESS, resultArr);
  }

  /**
   * @description 得到基础路径
   * @param file
   */
  async getBasePath(file: File): Promise<string> {
    let { ownerId, contentId } = file,
      content: Content = new Content();

    content.ownerId = ownerId;
    content.id = contentId;

    return ContentServiceImpl.getPath(content);
  }
}