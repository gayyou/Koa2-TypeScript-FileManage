import { Filter } from "./core/Filter";
import { Dispatch } from "./core/Dispatch";

require('./app/router');

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');

// 过滤请求，一些没有在router定义的路径进行过滤

app.use(Filter);

// 处理formdata上传的文件
app.use(koaBody({ multipart: true }));

// 对请求体进行解析
app.use(bodyParser());

app.use(Dispatch);
// 使用分发器
// app.use(Dispatch);

// app.use(Filter);

// let server = app.callback(() => {
  
// })
app.listen(8080)

// console.log(app.getServer)

app.use(bodyParser());