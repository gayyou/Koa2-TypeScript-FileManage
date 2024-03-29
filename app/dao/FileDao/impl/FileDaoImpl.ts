import { FileDao } from "../FileDao";
import { File } from '../../../model/bo/File'
import { querySqlStr } from "../../CreateConnection";
import {Content} from "../../../model/bo/Content";

export class FileDaoImpl implements FileDao {
  /**
   * @description 向数据库中添加字段
   * @param file
   */
  async addFile(file: File): Promise<any> {
    let { name, contentId, ownerId } = file,
        strSql = 'insert into file (name, parentid, ownerid) values (?, ?, ?);';

    let result: any = await querySqlStr(strSql, [name, contentId, ownerId]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  async searchFile(file): Promise<any> {
    let { name, contentId, ownerId } = file,
        strSql = 'select * from file where name = ? and parentid = ? and ownerid = ?';

    return await querySqlStr(strSql, [name, contentId, ownerId]);
  }

  async searchFileById(file): Promise<any> {
    let { id } = file,
        sqlStr = 'select * from file where id = ?;';

    return await querySqlStr(sqlStr, [id]);
  }

  /**
   * @description 修改文件名
   * @param file
   */
  async changeFileName(file: File): Promise<any> {
    let { name, id } = file,
        sqlStr = 'UPDATE file SET name=? where id=?;';

    let result: any = await querySqlStr(sqlStr, [name, id]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  /**
   * @description 移除文件
   * @param fileList
   */
  async removeFile(fileList: Array<File>): Promise<any> {
    let fileArr = [],
        sqlStr = 'delete from file where id in (',
        len = fileList.length;

    while(len--) {
      fileArr.push(fileList[len].id);
      sqlStr += '?,';
    }

    sqlStr = sqlStr.slice(0, sqlStr.length - 1);
    sqlStr += ');';

    let result: any = querySqlStr(sqlStr, [...fileArr])

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  /**
   * @description 上传文件
   * @param file
   */
  async uploadFile(file: File): Promise<any> {
    let { ownerId, contentId, name } = file,
        sqlStr = 'insert into file (parentid, ownerid, name) values (?, ?, ?, ?);';

    let result: any = querySqlStr(sqlStr, [contentId, ownerId, name]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  async searchChildrenFile(content: Content): Promise<any> {
    let { id } = content,
        sqlStr = 'select * from file where parentid = ?;';

    return await querySqlStr(sqlStr, [id]);
  }
}