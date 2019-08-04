import {RouterMap} from "../app/Router";

/**
 * @description 进行请求的分发，ctx是Filter中进行赋值，也就是进行匹配的控制层结果，新建一个controller对象并且执行
 * @param ctx
 * @param next
 * @constructor
 */
export async function Dispatch (ctx, next) {
  let routerMap: RouterMap = ctx.routerMap;

  try {
    let controller: any = new routerMap.module(ctx);
    let result = await controller[routerMap.funcName](ctx);
    ctx.status = 200;
    ctx.body = result;
  } catch (e) {
    ctx.status = 500;

  }
  await next();
}