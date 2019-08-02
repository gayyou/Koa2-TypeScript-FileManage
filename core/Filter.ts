const fs = require('fs')
import { parse } from 'url';
import { parseUrl } from '../app/router';
/**
 * @description 允许跨域请求
 * @param context 
 * @param next 
 */
export async function Filter(context: any, next) {
  // permitCrossDomain(context);
  let result = await FilterRouter(context);
  next(result);
}

async function FilterRouter(context: any) {
  let result = parseUrl(context.url);
  if (!result) {
    let html = await render('404.html')
    context.body = html;
  }
  return result;
}

function permitCrossDomain(context: any) {
  let res = context.response;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("cache-control", "no-cache");
  res.setHeader("content-type", "application/json; charset=utf-8");
}

async function render(page) {
  return new Promise((resolve, reject) => {
    let viewUrl = `../app/view/${page}`
    fs.readFile(viewUrl, "binary", (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}