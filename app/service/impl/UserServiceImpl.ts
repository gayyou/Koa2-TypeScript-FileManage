import {UserService} from "../UserService";
import {User} from "../../model/bo/User";
import {UserDaoImpl} from "../../dao/UserDao/impl/UserDaoImpl";
import {RequestResult} from "../../model/dto/RequestResult";

export class UserServiceImpl implements UserService {

  async login(user: User): Promise<RequestResult> {
    let { account, password } = user;
    // if (!/\\w+@\\w+(\\.\\w{2,3})*\\.\\w{2,3}/.test(account)) {
    //   return {
    //     success: false,
    //     result: new RequestResult(200, '邮箱格式出错', {})
    //   }
    // }

    let userDao = new UserDaoImpl();
    let result = await userDao.searchAccountPwd(user);
    if (result.length == 1) {
      user.id = result[0].id;

      return new RequestResult(200, '登陆成功', {
        account: user.account
      });
    }

    return new RequestResult(500, '登陆失败，请检查您的账号密码', {
      account: user.account
    })
  }

  async regist(user: User): Promise<RequestResult> {
    // let { account, password } = user;

    let userDao = new UserDaoImpl();
    let result = await userDao.searchAccount(user);
    if (result.length) {
      return new RequestResult(500, '添加账户失败，请不要重复注册账号', {})
    } else {
      let addResult = await userDao.addAccount(user);
      if (addResult) {
        return new RequestResult(200, '添加账户成功', {});
      }
      return new RequestResult(500, '添加账户失败，数据库产生未知错误', {});
    }
  }

}