import {RequestResult} from "../model/dto/RequestResult";
import {PostMapping, RequestMapping} from "../Router";
import {FileService} from "../service/FileService";
import {FileServiceImpl} from "../service/impl/FileServiceImpl";
import { File } from '../model/bo/File'
import {isNumber, isString, isUndef} from "../utils/typeUtils";
import {StatEnum} from "../enums/StatEnum";
import {Content} from "../model/bo/Content";

@RequestMapping('/file')
export class FileController {

  @PostMapping('/addfile')
  async addFile(ctx: any): Promise<RequestResult> {
    let request: any = ctx.request,
        { name, contentId } = request.body,
        filePath: any;
    if (isUndef(name) || isUndef(contentId)) {
      return new RequestResult(500, '未设置文件名', {});
    }

    // if (!isString(name) || !isNumber(contentId)) {
    //   return new RequestResult(500, '数据格式出错', {});
    // }

    try {
      filePath = request.files.file.path;
      console.log(request.files.file.path)
    } catch (e) {
      filePath = null;
    }
    if (filePath == null) {
      return new RequestResult(500, '没有上传文件', {});;
    }

    let file: File = new File();

    file.name = name;
    file.streamPath = filePath;
    file.contentId = parseInt(contentId);

    let user = ctx.session.user;
    if (isUndef(user)) {
      return new RequestResult(500, '请求已经过期', {});
    } else {
      file.ownerId = user.id
    }

    return await new FileServiceImpl().addFile(file);
  }

  @PostMapping('/deletefile')
  async deleteFile(ctx: any): Promise<RequestResult> {
    let { id } = ctx.request.body;

    if (isUndef(id)) {
      return new RequestResult(500, StatEnum.REQUEST_DATA_FORMAT_IS_ERROR, {});
    }
    let file = new File();

    file.id = id;
    return new FileServiceImpl().removeFile(file);
  }

  @PostMapping('/changename')
  async changeFileName(ctx: any): Promise<RequestResult> {
    let { fileId, name } = ctx.request.body;
    let file = new File();

    file.id = fileId;
    file.name = name;

    return await new FileServiceImpl().changeFileName(file);
  }

  @PostMapping('/seachfiles')
  async searchContentAllFile(ctx: any): Promise<RequestResult> {
    let { contentId } = ctx.request.body;

    if (isUndef(contentId)) {
      return new RequestResult(500, StatEnum.REQUEST_DATA_FORMAT_IS_ERROR, {});
    }

    let content: Content = new Content();
    content.id = contentId;
    return await new FileServiceImpl().searchContentAllFiles(content);
  }
}