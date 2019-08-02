import { File } from '../../model/File'

export interface FileDao {
  addFile(file: File): Promise<any>;

  removeFile(fileList: Array<File>): Promise<any>;

  uploadFile(file: File): Promise<any>;

  changeFileName(file: File): Promise<any>;
}