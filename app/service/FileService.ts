import {RequestResult} from "../model/dto/RequestResult";
import { File } from '../model/bo/File'
import {User} from "../model/bo/User";
import {Content} from "../model/bo/Content";

export interface FileService {
  addFile(file: File): Promise<RequestResult>;

  removeFile(file: File): Promise<RequestResult>;

  changeFileName(file: File): Promise<RequestResult>;

  searchContentAllFiles(content: Content): Promise<RequestResult>;

  getBasePath(file: File): Promise<string>;
}