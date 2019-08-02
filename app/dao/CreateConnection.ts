import { mysqlConfig } from '../../config/mysql.config'
import { mysql } from 'mysql'
import { resolve } from 'dns';

const connection = mysql.createConnection(mysqlConfig);

/**
 * @description connection是创建好的mysql连接器，而下面是接口对数据库进行查询
 * @param sqlStr 
 * @param args 
 */
export const querySqlStr = async (sqlStr: string, args: Array<any>) => {
  return await new Promise((resolve: Function) => {
    connection.query(sqlStr, args, (err: Error, result: any) => {
      if (err) {
        throw err;
      }
      if (result) {
        resolve(result);
      }
    })
  })
}

connection.connect();