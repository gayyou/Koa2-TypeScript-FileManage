import { UserDao } from "../UserDao";
import { User } from "../../../model/User";
import { querySqlStr } from "../../CreateConnection";

export class UserDaoImpl implements UserDao {
  /**
   * @description 添加用户，用于注册
   * @param user 
   */
  async addAccount (user: User): Promise<boolean> {
    let { account, password }: any = user,
        sqlstr = 'INSERT INTO user (account, password) VALUES (?, ?);';
    
    let result: any = await querySqlStr(sqlstr, [account, password]);

    if (result.affectedRows != 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description 通过账号密码进行查询，用于登陆
   * @param user 
   */
  async searchAccountPwd (user: User): Promise<any> {
    let { account, password }: any = user,
        sqlstr = 'select * from user where account=? and password=?;';
    
    return await querySqlStr(sqlstr, [account, password]); 
  }

  /**
   * @description 查询账号
   * @param user 
   */
  async searchAccount (user: User): Promise<any> {
    let { account }: any = user,
        sqlstr = 'select * from user where account=?;';

    return await querySqlStr(sqlstr, [account]);
  }

  /**
   * @description 修改密码
   * @param user 
   */
  async changePassword (user: User): Promise<any> {
    let { account, password }: any = user,
        sqlstr = 'UPDATE user SET password=? where account=?;';

    let result: any = await querySqlStr(sqlstr, [password, account]);

    if (result.affectedRows != 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description 删除普通用户
   * @param user 
   */
  async deleteAccount (user: User): Promise<any> {
    let { account }: any = user,
        sqlstr = 'DELETE FROM user WHERE account=?;';

    let result: any =  await querySqlStr(sqlstr, [account]);
    
    if (result.affectedRows != 0) {
      return true;
    } else {
      return false;
    }
  }
}