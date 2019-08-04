import {RequestResult} from "../model/dto/RequestResult";
import {PostMapping, RequestMapping} from "../Router";
import {FileService} from "../service/FileService";
import {FileServiceImpl} from "../service/impl/FileServiceImpl";
import { File } from '../model/bo/File'
import {isNumber, isString, isUndef} from "../utils/typeUtils";

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

    if (!isString(name) || !isNumber(contentId)) {
      return new RequestResult(500, '数据格式出错', {});
    }

    try {
      filePath = request.files.files.File.path;
    } catch (e) {
      filePath = null;
    }
    if (filePath == null) {
      return new RequestResult(500, '没有上传文件', {});;
    }

    let file: File = new File({
      name,
      path: filePath,
      contentId
    });

    let user = ctx.session.user;
    if (isUndef(user)) {
      return new RequestResult(500, '请求已经过期', {});
    } else {
      file.ownerId = user.id
    }

    let fileService: FileService = new FileServiceImpl();
    return await fileService.addFile(file);
  }

  @PostMapping('/deletefile')
  async deleteFile(ctx: any): Promise<RequestResult> {
    return ;
  }

  @PostMapping('/changename')
  async changeFileName(ctx: any): Promise<RequestResult> {
    return ;
  }

  @PostMapping('/seachfiles')
  async searchContentAllFile(ctx: any): Promise<RequestResult> {
    return ;
  }
}