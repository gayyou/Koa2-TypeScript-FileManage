const path = require('path');
const fs = require('fs');
const bashPath = '../public/server';

/**
 * @description 进行文件目录的操作
 */
export class DirectoryOperate {
  path: string = '';

  constructor(path: string) {
    this.path = bashPath + path;
  }

  public async createDir(targetPath: string): Promise<any> {
    targetPath = targetPath ? bashPath + targetPath : this.path;

    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      return true;
    } else if (isExist) {
      return false;
    }

    // 如果查询不到目标目录的话，有可能路径是完全没有的，那么就要进行递归查询
    let tempDir = path.parse(targetPath).dir;

    // 进行判断上级目录是否存在，如果不存在还是会继续创建目录
    let status = await this.createDir(tempDir);
    let mkdirStatus;

    if (status) {
      mkdirStatus = await this.mkdir(targetPath);
    }

    return mkdirStatus;
  }

  public async deleteDir(targetPath: string) {
    targetPath = targetPath ? bashPath + targetPath : this.path || '';

    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      return await this.deleteDirTool(targetPath);
    } else if (isExist) {
      throw new Error('the target path is a file, not a directory!');
    } else {
      throw new Error('can not fine the target path');
    }
  }

  /**
   * @description 将文件夹进行重命名
   * @param newName
   * @param targetPath
   */
  public async renameDir(newName: string, targetPath: string) {
    targetPath = targetPath ? bashPath + targetPath : this.path;

    let basePathArr: Array<string> = targetPath.split('/');

    if (!basePathArr.length) {
      throw new Error('the path length is zero');
    }

    let basePath: string = basePathArr.splice(-1, 1).join('/');

    let isExist: any = await DirectoryOperate.getStat(targetPath);

    if (isExist && isExist.isDirectory()) {
      return await fs.renameSync(targetPath,basePath + newName);
    } else if (isExist) {
      throw new Error('the target path is a file, not a directory!');
    }
    throw new Error('can not fine the target path');
  }

  /**
   * @description 进行递归删除文件夹内部的所有文件操作
   * @param dir
   */
  private deleteDirTool(dir: string) {
    return new Promise (function (resolve, reject) {
      //先读文件夹
      fs.stat(dir, function (err, stat) {
        if (stat.isDirectory()) {
          fs.readdir(dir, function (err, files) {
            files = files.map(file => path.join(dir, file)); // 首先将这个目录下的所有文件进行读取文件名，加上基础路径
            files = files.map(file => this.deleteDirTool(file)); // 重新遍历一下，将子内容递归进行删除，并且删除的动作都返回一个Promise操作
            Promise.all(files).then(function () {
              // 当所有的Promise操作均成功的时候进行操作
              fs.rmdir(dir, resolve);
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
  static getStat(path: string) {
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
  private mkdir(dir: string){
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if(err){
          resolve(false);
        }else{
          resolve(true);
        }
      })
    })
  }
}