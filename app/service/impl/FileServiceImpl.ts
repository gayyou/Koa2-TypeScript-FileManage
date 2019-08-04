import {FileService} from "../FileService";
import {RequestResult} from "../../model/dto/RequestResult";
import { File } from '../../model/bo/File'
import {User} from "../../model/bo/User";
import {FileDaoImpl} from "../../dao/FileDao/impl/FileDaoImpl";
import {FileDao} from "../../dao/FileDao/FileDao";
import {ContentDaoImpl} from "../../dao/ContentDao/impl/ContentDaoImpl";
import {ContentDao} from "../../dao/ContentDao/ContentDao";
import {Content} from "../../model/bo/Content";
import {isUndef} from "../../utils/typeUtils";
import {getBasePath} from "../../utils/utils";
import {FileOperate} from "../../dao/FileOperate";

export class FileServiceImpl implements FileService {
  fileDao: FileDao;

  constructor() {
    this.fileDao = new FileDaoImpl();
  }

  async addFile(file: File): Promise<RequestResult> {
    // 获取文件的基础路径
    let basePath: string = await this.getBasePath(file),
        fileOperate: FileOperate = new FileOperate();

    file.contentPath = basePath;
    file.url = basePath + file.name;
    let result: any = await fileOperate.searchFile(file);

    // 查询数据库中是否存在该文件
    let fileList: any = this.fileDao.searchFile(file);

    if (fileList.length) {
      if (result && result.isFile) {
        return new RequestResult(500, '已经存在目标文件了，请勿重复创建文件', file);
      } else if (result) {
        return new RequestResult(500, '目标文件是一个文件夹', file);
      }
      throw  new Error('发生了数据库和文件系统的信息不一致问题');
    }

    if (fileOperate.writeFile(file)) {
      return new RequestResult(200, '创建文件成功', file);
    }
    return new RequestResult(500, '创建文件失败，并且数据库发生了未知错误', file);
  }

  async changeFileName(file: File, user: User): Promise<RequestResult> {
    return ;
  }

  async removeFile(file: File, user: User): Promise<RequestResult> {
    return ;
  }

  async searchContentAllFiles(file: File, user: User): Promise<RequestResult> {
    return ;
  }

  /**
   * @description 得到基础路径
   * @param file
   */
  async getBasePath(file: File): Promise<string> {
    let pathArr: Array<string> = [],
      { ownerId, contentId } = file;

    let contentDao: ContentDao = new ContentDaoImpl(),
        content: Content = new Content();
    content.ownerId = ownerId;
    content.id = contentId;


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