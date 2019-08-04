import { parse } from "url";
import {resolve} from 'path';
const glob = require('glob');

const methodsModel: Array<String> = [
  'post',
  'get',
  'delete',
  'put'
];

export interface RouterMap{
  module: any,
  funcName: string
}

export class Router {
  targetPath: string;
  private isInit: boolean = false;

  constructor(targetPath: string) {
    this.targetPath = targetPath;
  }

  init() {
    glob.sync(resolve(__dirname.replace(/\\/g, '/') + this.targetPath + '/**/*.*')).forEach(require);
    console.log('路由已经启动完毕');
    this.isInit = true;
  }

  // 让这个分发函数指向router的原因是为了判断router是否初始化，如果没有初始化的时候则进行初始化，
  // 并且初始化结束后将这个方法指向router方法，避免以后每次请求的分发都要进行判断是否初始化
  async getRouter(path: string, method: string): Promise<RouterMap> {
    if (!this.isInit) {
      this.init();
    }
    let result: RouterMap = await this.router(path, method);
    this.getRouter = this.router;
    return result;
  }

  private async router(path: string, method: string): Promise<RouterMap> {
    method = method.toLocaleLowerCase();  // 小写化
    if (!methodsModel.includes(method)) {
      throw new Error(`The request method is not in ${ [...methodsModel] }`)
    }
    let { pathname }: any = parse(path) || '';
    return requestMap.get(method).get(pathname);
  }
}

const requestMap: Map<string, Map<string, RouterMap>> = new Map();
const postMap: Map<string, RouterMap> = new Map();
const getMap: Map<string, RouterMap> = new Map();
const putMap: Map<string, RouterMap> = new Map();
const deleteMap: Map<string, RouterMap> = new Map();
requestMap.set('post', postMap);
requestMap.set('get', getMap);
requestMap.set('put', putMap);
requestMap.set('delete', deleteMap);

export const RequestMapping = bashPath => target => {
  for (let [method] of requestMap) {
    let tempMap: Map<string, RouterMap> = requestMap.get(method);

    for (let [path, value] of tempMap) {

      // 找到与当前类的方法定义好的路由映射,由于方法中只能获得原型，那么要在类里面进行原型的比较
      if (target.prototype === value.module) {
        let relovedPath: string = bashPath + path;  // 将路径前面添加类的基础路径
        value.module = target;
        tempMap.set(relovedPath, value);   // 设置处理后的结果
        tempMap.delete(path);  // 删除处理前的结果
      }
    }
  }
}

/**
 * @description 对方法进行装饰注入
 * @param methods
 */
const setRouter = methods => {
  // 这是在自定义请求Mapping的时候进行定义
  if (!methodsModel.includes(methods)) {
    throw new Error(`The request method is not in ${ [...methodsModel] }, please add the method item or change method`)
  }

  return (path) => {
    let methodsMap = requestMap.get(methods);  // 获得对应请求方式的Map
    if (methodsMap.get(path)) {
      throw new Error(`${ methods } request url ${ path } in router map is repeat, check your router`);
    }

    return (target: any, funcName: string) => {
      methodsMap.set(path, {
        module: target,  // 这个是Controller类的原型，到后面再类里面进行映射的时候，就会换成类
        funcName: funcName
      })
    }
  }
}

export const GetMapping = setRouter('get');
export const PostMapping = setRouter('post');
export const PutMapping = setRouter('put');
export const DeleteMapping = setRouter('delete');

// export const router = new Map();
//
// export interface ClassRouter {
//   module: Function,
//   funcName: string
// }
//
// /**
//  * @description 这个函数是在服务器启动的时候，将后台的所有的router进行解析获取文件
//  * 并且存放到router内存当中去，后面请求进来的时候，直接在router进行获取数据
//  * @version 1.0.1
//  * @author Weybn
//  * @param options 所有已经配置好的路由
//  */
// let resolveRouter = (options: any) => {
//   let keys: Array<any> = Reflect.ownKeys(options),
//       len: number = keys.length;
//
//   // 遍历属性，将router提取出来
//   while(len--) {
//     // 在options中的每一个router的每一个属性的键值，这个键值就是请求的路径
//     let childRouter = options[keys[len]];
//     let routerPaths: Array<any> = Object.keys(childRouter),
//         pathsLen = routerPaths.length;
//
//     while(pathsLen--) {
//       router.set(routerPaths[pathsLen], getClassByPath(childRouter[routerPaths[pathsLen]]));
//     }
//   }
//
//   console.log('Router is loaded!')
//   // 处理完毕后，将这个函数以及getClassByPath从内存删除，因为不会再使用到了。
//   resolveRouter = null;
//   getClassByPath = null;
// }
//
// let getClassByPath = (path): ClassRouter | null => {
//   let bashPath: string = './controller/',
//       modules: any = null,
//       paths = path.split('/'),
//       classPath = paths.slice(0, -1).join('/'),
//       controllerName: string = paths[paths.length - 2];
//   try {
//     modules = require(bashPath + classPath)[controllerName];
//   } catch (e) {
//     console.log(`路径${ path } 找不到对应的类，请检查对应路径`);
//     return null;
//   }
//
//   if (!modules) {
//     throw new Error(`找不到类名，请确定您输入的路径${ path }是否正确`)
//   }
//
//   // 返回的结果为：模块的类的指向，以及这个controller方法
//   return {
//     module: modules,
//     funcName: paths[paths.length - 1]
//   };
// }
//
// // 将所有的路由配置写入内存中
// resolveRouter(options)
//
// export function parseUrl(url: string): ClassRouter | null {
//   let { pathname }: any = parse(url) || '';
//
//   let result: ClassRouter | undefined = router.get(pathname);
//   return result;
// }

// 由路径来动态解析路由
// TODO 不会进行使用这种方式来获取路径，因为这样子每次请求来都会进行计算，浪费资源，直接写静态路由
// export interface MatchResult {
//   action: string,
//   module: any
// }

// export class Router {
//   controllerPath: string;

//   static controllerMap: any = {};

//   constructor(controllerPath: string) {
//     this.controllerPath = controllerPath;
//   }

//   public match(url: string) {
//     let pathName: any = parse(url) || '',
//         paths = pathName.split('/'),
//         controller: string = paths[1] || 'index';

//     // 进行缓存策略，只要找到一次就会进行缓存，下次再有相同的路径的时候就无需进行遍历
//     if (Router.controllerMap[controller]) return Router.controllerMap[controller];

//     let action: string = paths[2] || 'index',
//         args: Array<string> = paths.slice(3),
//         controllerName: string = '',
//         Controller: any,
//         result: MatchResult = {
//           action: action,
//           module: null
//         }

//     try {
//       controllerName = controller[0].toLocaleUpperCase() + controller.slice(1) + 'ControllerImpl';
//       Controller = require('./'+ this.controllerPath + controllerName + '/impl/');
//       result.module = Controller;
//       // 对该类的指向进行缓存，下次方便下次请求相同的路径的时候直接获取。
//       Router.controllerMap[controller] = Controller;
//     } catch (e) {
//       console.log(e);
//     }

//     return result;
//   }
// }