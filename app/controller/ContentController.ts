import {RequestResult} from "../model/dto/RequestResult";
import {PostMapping, RequestMapping} from "../Router";
import {isNumber, isString, isUndef} from "../utils/typeUtils";
import {Content} from "../model/bo/Content";
import {User} from "../model/bo/User";
import {ContentServiceImpl} from "../service/impl/ContentServiceImpl";
import {StatEnum} from "../enums/StatEnum";
import {is} from "type-is";

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
    let content: Content = new Content();
    // 获取session值
    let user: User = ctx.session.user;
    if (!user) {
      return new RequestResult(500, StatEnum.SESSION_IS_TIMEOUT, {});
    }
    // 初始化对象值
    content.name = name;
    content.parentId = parentId == 0 ? null : parentId;
    content.ownerId = user.id;
    return await new ContentServiceImpl().addContent(content);
  }

  @PostMapping('/removecontent')
  async removeContent(ctx): Promise<RequestResult> {
    let { contentId } = ctx.request.body;

    if (isUndef(contentId)) {
      return new RequestResult(500, StatEnum.REQUEST_DATA_FORMAT_IS_ERROR, {});
    }

    if (!isNumber(contentId)) {
      return new RequestResult(500, StatEnum.REQUEST_DATA_TYPE_IS_ERROR, {});
    }

    let content: Content = new Content();
    content.id = contentId;
    return await new ContentServiceImpl().deleteContent(content);
  }

  @PostMapping('/searchallchildren')
  async searchAllChildren(ctx): Promise<RequestResult> {
    let { contentId } = ctx.request.body;

    let content: Content = new Content();
    content.id = contentId;
    if (!ctx.session.user) {
      return new RequestResult(500, StatEnum.SESSION_IS_TIMEOUT, {});
    }

    content.ownerId = ctx.session.user.id;

    return await new ContentServiceImpl().searchAllChildContent(content);
  }

  @PostMapping('/rename')
  async renameContent(ctx): Promise<RequestResult> {
    let { contentId, changeName } = ctx.request.body;

    if (isUndef(contentId) || isUndef(changeName)) {
      return new RequestResult(500, StatEnum.REQUEST_DATA_FORMAT_IS_ERROR, {});
    }

    let content: Content = new Content();
    content.id = contentId;
    content.name = changeName;

    return await new ContentServiceImpl().renameContent(content);
  }
}