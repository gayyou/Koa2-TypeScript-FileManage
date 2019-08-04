import {RequestResult} from "../model/dto/RequestResult";
import {PostMapping, RequestMapping} from "../Router";
import {isNumber, isString, isUndef} from "../utils/typeUtils";
import {Content} from "../model/bo/Content";
import {User} from "../model/bo/User";
import {ContentServiceImpl} from "../service/impl/ContentServiceImpl";

@RequestMapping('/content')
export class ContentController {

  @PostMapping('/addcontent')
  async addContent(ctx): Promise<RequestResult> {
    let { parentId, name } = ctx.request.body;

    if (isUndef(parentId) || isUndef(name)) {
      return new RequestResult(500, '传输过来的数据出错', {});
    }

    if (!isNumber(parentId) || !isString(name)) {
      return new RequestResult(500, '请检查数据格式是否正确', {});
    }

    // 进行新建content对象
    let content: Content = new Content({
      name,
      parentId
    });
    // 获取session值
    let user: User = ctx.session.user;
    if (!user) {
      return new RequestResult(500, '登陆过期，请重新登陆', {});
    }
    content.ownerId = user.id;
    return await new ContentServiceImpl().addContent(content);
  }

  @PostMapping('/removecontent')
  async removeContent(ctx): Promise<RequestResult> {
    return ;
  }

  @PostMapping('/searchallchildren')
  async searchAllChildren(ctx): Promise<RequestResult> {
    return ;
  }

  @PostMapping('/rename')
  async renameContent(ctx): Promise<RequestResult> {
    return ;
  }
}