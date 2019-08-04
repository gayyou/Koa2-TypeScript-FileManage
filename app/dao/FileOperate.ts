import { File } from '../model/bo/File'
import {DirectoryOperate} from "./DirectoryOperate";
const path = require('path');
const fs = require('fs');
import { bashPath } from "./DirectoryOperate";
import {getBasePath} from "../utils/utils";

export class FileOperate {
  constructor() {

  }
  /**
   * @description 将formdata传回来的字节流进行解析成为
   * @param file
   */
  public async writeFile(file: File | undefined): Promise<any> {
    if (!file) {
      throw new Error('file is not defined');
    }

    let path = file.streamPath,
      reader = fs.createReadStream(path),
      savePath = bashPath + file.url;

    if (!await DirectoryOperate.getStat(savePath)) {
      // 如果不存在目标路径，那么就返回false
      return false;
    }

    let stream = fs.createWriteStream(savePath);

    return await new Promise((resolve, reject) => {
      try {
        reader.pipe(stream);

        // 当reader关闭的时候再返回
        reader.on('close', () => {
          resolve(true);
        })
        reader.on('error', (error) => {
          reject(error);
        })
      } catch (e) {
        reject(e);
      }
    })
  }

  /**
   * @description 修改文件名
   * @param newName
   * @param file
   */
  public async renameFile(newName, file: File | undefined) {
    if (!file) {
      throw new Error('file is not defined');
    }

    let isExist: any = await DirectoryOperate.getStat(file.url);

    if (isExist && !isExist.isDirectory()) {
      // 目标存在，并且不是目录，那么就符合要求，进行修改文件名

      let basePath: string = getBasePath(file.url);  // 得到父容器的路径

      return await fs.renameSync(file.url,basePath + newName);  // 异步修改文件名并返回结果
    } else if (isExist) {
      throw new Error('the target is a directory');
    }
    throw  new Error('The url is not exist');
  }

  public async deleteFile (file: File | undefined) {
    if (!file) {
      throw new Error('file is not defined');
    }

    let isExist: any = await DirectoryOperate.getStat(file.url);

    if (isExist && !isExist.isDirectory()) {
      // 目标存在，并且不是目录，那么就符合要求，进行修改文件名
      return await new Promise((resolve, reject) => {
        try {
          fs.unlink(file.url, resolve)
        } catch (e) {
          reject(e);
        }
      })
    } else if (isExist) {
      throw new Error('the target is a directory');
    }
    throw  new Error('The url is not exist');
  }

  /**
   * @description 寻找文件
   * @param file
   */
  public async searchFile(file: File): Promise<any> {
    let { url } = file;

    let isExist: any = await DirectoryOperate.getStat(url);

    if (isExist && !isExist.isDirectory()) {
      return {
        isFile: true
      };
    } else if (isExist) {
      return {
        isDirectory: true
      }
    }
    return null;
  }


}