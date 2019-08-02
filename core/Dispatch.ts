import { parseUrl } from "../app/router";

export async function Dispatch (ctx, next) {
  let result: any = parseUrl(ctx.url);

  try {
    let modules = new result['module'](ctx);
    modules[result.funcName]();

  } catch (error) {
    console.log('The Dispatch catch error: ' + error)
  }

  return ;
}