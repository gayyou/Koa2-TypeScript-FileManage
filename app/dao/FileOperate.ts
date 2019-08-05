import {File} from '../model/bo/File'
import {bashPath, DirectoryOperate} from "./DirectoryOperate";
import {getBasePath} from "../utils/utils";
import {StatEnum} from "../enums/StatEnum";

const path = require('path');
const fs = require('fs');

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


    let isExist = await DirectoryOperate.getStat(savePath)

    if (isExist) {
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
  public async renameFile(newName, file: File | undefined): Promise<StatEnum> {
    if (!file) {
      throw new Error('file is not defined');
    }

    let pathName = bashPath + file.url;

    let isExist: any = await DirectoryOperate.getStat(pathName);

    console.log(file.url)


    if (isExist && !isExist.isDirectory()) {
      // 目标存在，并且不是目录，那么就符合要求，进行修改文件名

      let basePath: string = getBasePath(pathName);  // 得到父容器的路径

      await fs.renameSync(pathName,basePath + newName);  // 异步修改文件名并返回结果
      return StatEnum.SUCCESS;
    } else if (isExist) {
      return StatEnum.FILE_IS_SAME_OF_DIR;
    }

    return StatEnum.FILE_IS_NOT_EXIST;
  }

  public async deleteFile (file: File | undefined): Promise<StatEnum> {
    if (!file) {
      throw new Error('file is not defined');
    }
    let pathName = bashPath + file.url;
    let isExist: any = await DirectoryOperate.getStat(pathName);

    if (isExist && !isExist.isDirectory()) {
      // 目标存在，并且不是目录，那么就符合要求，进行修改文件名
      return await new Promise((resolve, reject) => {
        try {
          fs.unlink(pathName, () => {
            resolve(StatEnum.SUCCESS)
          })
        } catch (e) {
          reject(e);
        }
      })
    } else if (isExist) {
      return StatEnum.FILE_IS_SAME_OF_DIR;
    }
    return StatEnum.FILE_IS_NOT_EXIST;
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