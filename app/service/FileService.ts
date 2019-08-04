import {RequestResult} from "../model/dto/RequestResult";
import { File } from '../model/bo/File'
import {User} from "../model/bo/User";

export interface FileService {
  addFile(file: File): Promise<RequestResult>;

  removeFile(file: File, user: User): Promise<RequestResult>;

  changeFileName(file: File, user: User): Promise<RequestResult>;

  searchContentAllFiles(file: File, user: User): Promise<RequestResult>;

  getBasePath(file: File): Promise<string>;
}