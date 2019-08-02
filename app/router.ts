import { parse } from "url";
import * as options from './router/index'

export const router = new Map();

export interface ClassRouter {
  module: Function,
  funcName: string 
}

/**
 * @description 这个函数是在服务器启动的时候，将后台的所有的router进行解析获取文件
 * 并且存放到router内存当中去，后面请求进来的时候，直接在router进行获取数据
 * @version 1.0.1
 * @author Weybn
 * @param options 所有已经配置好的路由
 */
let resolveRouter = (options: any) => {
  let keys: Array<any> = Reflect.ownKeys(options),
      len: number = keys.length;

  // 遍历属性，将router提取出来
  while(len--) {
    // 在options中的每一个router的每一个属性的键值，这个键值就是请求的路径
    let childRouter = options[keys[len]];
    let routerPaths: Array<any> = Object.keys(childRouter),
        pathsLen = routerPaths.length;

    while(pathsLen--) {
      router.set(routerPaths[pathsLen], getClassByPath(childRouter[routerPaths[pathsLen]]));
    }
  }

  console.log('Router is loaded!')
  // 处理完毕后，将这个函数以及getClassByPath从内存删除，因为不会再使用到了。
  resolveRouter = null;
  getClassByPath = null;
}

let getClassByPath = (path): ClassRouter | null => {
  let bashPath: string = './controller/',
      modules: any = null,
      paths = path.split('/'),
      classPath = paths.slice(0, -1).join('/'),
      controllerName: string = paths[paths.length - 2];
  try {
    modules = require(bashPath + classPath)[controllerName];
  } catch (e) {
    console.log(`路径${ path } 找不到对应的类，请检查对应路径`);
    return null;
  }

  if (!modules) {
    throw new Error(`找不到类名，请确定您输入的路径${ path }是否正确`)
  }

  // 返回的结果为：模块的类的指向，以及这个controller方法
  return {
    module: modules,
    funcName: paths[paths.length - 1]
  };
}

// 将所有的路由配置写入内存中
resolveRouter(options)

export function parseUrl(url: string): ClassRouter | null {
  let { pathname }: any = parse(url) || '';

  let result: ClassRouter | undefined = router.get(pathname);
  return result;
}


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