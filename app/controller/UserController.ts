import {GetMapping, PostMapping, RequestMapping} from "../Router";
import {RequestResult} from "../model/dto/RequestResult";
import {User} from "../model/bo/User";
import {UserServiceImpl} from "../service/impl/UserServiceImpl";

@RequestMapping('/user')
export class UserController {
  @PostMapping('/login')
  async login(ctx: any): Promise<RequestResult> {
    let { account, password } = ctx.request.body;

    if (!account || !password) {
      return new RequestResult(500, '请求数据缺失', {});
    }
    if (typeof account != 'string' || typeof password != 'string') {
      return new RequestResult(500, '请求数据格式出错', {});
    }
    let user: User = new User({
      account,
      password
    });
    let result = await new UserServiceImpl().login(user);
    if (result.status === 200) {
      ctx.session.user = user;
    }
    return result;
  }


  @PostMapping('/regist')
  async regist(ctx: any): Promise<RequestResult> {
    let { account, password } = ctx.request.body;
    if (!account || !password) {
      return new RequestResult(500, '请求数据缺失', {});
    }
    if (typeof account != 'string' || typeof password != 'string') {
      return new RequestResult(500, '请求数据格式出错', {});
    }
    let user: User = new User({
      account,
      password,
    });

    return await new UserServiceImpl().regist(user);
  }
}