import { ContentDao } from "../ContentDao";
import {Content} from "../../../model/bo/Content";
import {querySqlStr} from "../../CreateConnection";

export class ContentDaoImpl implements ContentDao {
  /**
   * @description 添加文件目录
   * @param content
   */
  async addContent(content: Content): Promise<any> {
    let { ownerId, parentId, name, level } = content,
        sqlStr = 'insert into content (parentid, name, level, ownerid) values (?, ?, ?, ?);';

    let result: any = await querySqlStr(sqlStr, [parentId, name, level, ownerId]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  /**
   * @description 修改文件目录
   * @version 1.0.0
   * @param content
   */
  async changeContent(content: Content): Promise<any> {
    let { name, id } = content,
        sqlStr = 'UPDATE content SET name=? where id=?;';

    let result: any = await querySqlStr(sqlStr, [name, id]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  /**
   * @description 删除目录
   * @param content
   */
  async removeContent(contentList: Array<Content>): Promise<any> {
    let idArray = [],
        sqlStr: string = 'DELETE FROM content WHERE id IN (';
    for (let i = 0; i < contentList.length; i++) {
      idArray.push(contentList[i].id);
      sqlStr += '?,';
    }
    sqlStr.substring(sqlStr.length - 1);
    sqlStr += ');';

    let result: any = await querySqlStr(sqlStr, [...idArray]);

    if (result.affectedRows != 0) {
      return true;
    }
    return false;
  }

  /**
   * @description 查询目录
   * @param content
   */
  async searchContent(content: Content): Promise<any> {
    let { id } = content,
        sqlStr = 'select * from content where id = ?;';

    return await querySqlStr(sqlStr, [id]);
  }

  /**
   * @description 查找所有子节点
   * @param content
   */
  async searchChildrenListById(content: Content): Promise<any> {
    let { id } = content,
        sqlStr = 'select * from content where parentid = ?;';

    return await querySqlStr(sqlStr, [id]);
  }

  /**
   * @description 根据父节点以及名字来查找子节点
   * @param content
   */
  async searchChildContent(content: Content): Promise<any> {
    let { parentId, name } = content,
        sqlStr = 'select * from content where parentid = ? and name = ?';

    return await querySqlStr(sqlStr, [parentId, name]);
  }
}