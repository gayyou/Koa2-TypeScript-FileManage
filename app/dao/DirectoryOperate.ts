import {getBasePath} from "../utils/utils";
import {StatEnum} from "../enums/StatEnum";
import {isUndef} from "../utils/typeUtils";

const path = require('path');
const fs = require('fs');
export const bashPath = 'app/public/server/';

/**
 * @description 进行文件目录的操作
 */
export class DirectoryOperate {
  path: string = '';

  /**
   * @description 进行调用创建文件的入口方法，通过调用递归方法recCreateDir来进行文件夹的递归创建
   * @param targetPath
   */
  public async createDir(targetPath: string): Promise<StatEnum> {
    targetPath = targetPath ? bashPath + targetPath : this.path;

    return await this.recCreateDir(targetPath);
  }

  /**
   * @description 进行创建文件夹
   * @param targetPath
   */
  private async recCreateDir(targetPath: string): Promise<StatEnum> {
    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      return StatEnum.DIR_IS_EXIST;
    } else if (isExist) {
      return StatEnum.DIR_SAME_NAME_OF_FILE;
    }

    // 如果查询不到目标目录的话，有可能路径是完全没有的，那么要先进行查询父容器是否存在
    let tempDir: string = path.parse(targetPath).dir;
    let parentIsExist: any = await DirectoryOperate.getStat(tempDir);

    if (!parentIsExist) {
      // 如果父容器不存在的时候，那么就返回父容器不存在的错误
      return StatEnum.DIR_PARENT_IS_NOT_EXIST
    }

    // 进行创建目录，并且返回创建的结果
    let status: StatEnum = await this.mkdir(targetPath);

    return status;
  }

  public async deleteDir(targetPath: string): Promise<StatEnum> {
    targetPath = targetPath ? bashPath + targetPath : this.path || '';

    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      return await this.deleteDirTool(targetPath);
    } else if (isExist) {
      return StatEnum.DELETE_TARGET_IS_FILE;
      // throw new Error('the target path is a file, not a directory!');
    } else {
      return StatEnum.DELETE_PATH_IS_NOT_EXIST;
      // throw new Error('can not fine the target path');
    }
  }

  /**
   * @description 将文件夹进行重命名
   * @param newName
   * @param targetPath
   */
  public async renameDir(newName: string, targetPath: string): Promise<StatEnum> {
    targetPath = targetPath ? bashPath + targetPath : this.path;

    let newBashPath: string = getBasePath(targetPath);  // 得到父容器的路径

    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      await fs.renameSync(targetPath,newBashPath + '/' + newName);
      return StatEnum.SUCCESS;
    } else if (isExist) {
      return StatEnum.DIR_SAME_NAME_OF_FILE;
    }
    return StatEnum.DIR_IS_NOT_EXIST;
  }

  /**
   * @description 进行递归删除文件夹内部的所有文件操作
   * @param dir
   */
  private deleteDirTool(dir: string): Promise<StatEnum> {
    return new Promise ((resolve, reject) => {
      //先读文件夹
      fs.stat(dir, (err, stat) => {
        if (stat.isDirectory()) {
          fs.readdir(dir, (err, files) => {
            files = files.map(file => path.join(dir, file)); // 首先将这个目录下的所有文件进行读取文件名，加上基础路径
            files = files.map(file => this.deleteDirTool(file)); // 重新遍历一下，将子内容递归进行删除，并且删除的动作都返回一个Promise操作
            Promise.all(files).then(() => {
              // 当所有的Promise操作均成功的时候进行操作
              fs.rmdir(dir, (err: any, res: any) => {
                resolve(StatEnum.SUCCESS);
              });  // 将这个文件夹进行删除
            })
          })
        } else {
          fs.unlink(dir, resolve)
        }
      })
    })
  }

  /**
   * @description 查询路径是否有存在文件或者文件夹
   * @param path
   */
  static getStat(path: string): any {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if(err){
          resolve(false);
        }else{
          resolve(stats);
        }
      })
    })
  }

  /**
   * 创建路径
   * @param {string} dir 路径
   */
  private mkdir(dir: string): Promise<StatEnum>{
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if(err){
          resolve(StatEnum.FAIL);
        }else{
          resolve(StatEnum.SUCCESS);
        }
      })
    })
  }
}