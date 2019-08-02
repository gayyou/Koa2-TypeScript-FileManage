import { File } from '../model/File'
import {DirectoryOperate} from "./DirectoryOperate";
const path = require('path');
const fs = require('fs');
const bashPath = '../public/server';

export class FileOperate {
  basePath: string;
  name: string;

  constructor(options: any) {

  }
  /**
   * @description 将formdata传回来的字节流进行解析成为
   * @param file
   */
  public async writeFile(file: File): Promise<any> {
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

  public async renameFile() {

  }
}