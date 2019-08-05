import { File } from '../../model/bo/File'
import {Content} from "../../model/bo/Content";

export interface FileDao {
  addFile(file: File): Promise<any>;

  removeFile(fileList: Array<File>): Promise<any>;

  uploadFile(file: File): Promise<any>;

  searchFile(file: File): Promise<any>;

  changeFileName(file: File): Promise<any>;

  searchFileById(file: File): Promise<any>;

  searchChildrenFile(content: Content): Promise<any>;
}