import { Filter } from "./core/Filter";
import { Dispatch } from "./core/Dispatch";
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const session = require('koa-session');

app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess',   //cookie key (default is koa:sess)
  maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired,
};


// 过滤请求，一些没有在router定义的路径进行过滤
app.use(Filter);

// 处理formdata上传的文件
app.use(koaBody({ multipart: true }));

// 保存session
app.use(session(CONFIG, app));
//
// // 使用分发器
app.use(Dispatch);

app.listen(8080)