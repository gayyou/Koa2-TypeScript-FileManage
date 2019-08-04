const fs = require('fs')
import {Router, RouterMap} from '../app/Router';
/**
 * @description 允许跨域请求
 * @param context 
 * @param next 
 */

const router = new Router('/controller');  // 新建路由
router.init();

export async function Filter(context: any, next) {
  // permitCrossDomain(context);
  let reuslt = await FilterRouter(context);
  if (reuslt) {
    await next();
  }
}

async function FilterRouter(context: any) {
  // 查询路由是否存在这个请求的路径
  let result: RouterMap = await router.getRouter(context.url, context.request.method);

  if (!result) {
    // 如果匹配不到请求的路径的话，那么就会
    let html = await render('404.html');
    context.status = 404;
    context.body = html;
    return null;
  }
  context.routerMap = result;
  return result;
}

function permitCrossDomain(context: any) {
  let res = context.response;
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.header("cache-control", "no-cache");
  res.header("content-type", "application/json; charset=utf-8");
}

// function requestDataType(context: any) {
//
// }

async function render(page) {
  return new Promise((resolve, reject) => {
    let viewUrl = `app/view/${page}`
    fs.readFile(viewUrl, "binary", (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}