export enum StatEnum {
  None = '',

  SUCCESS = '执行成功',
  FAIL = '执行失败',

  /**
   * session状态码
   */
  SESSION_IS_TIMEOUT = '请重新登陆',

  /**
   * 数据格式状态码
   */
  REQUEST_DATA_FORMAT_IS_ERROR = '请求数据格式出错',
  REQUEST_DATA_TYPE_IS_ERROR = '请求数据类型出错',

  /**
   * 创建目录的状态码
   */
  DIR_IS_EXIST = '目录已经存在',
  DIR_IS_NOT_EXIST = '目录没有存在',
  DIR_SAME_NAME_OF_FILE = '在该目录下有一个相同的文件名与想要创建的目录名一致',
  DIR_PARENT_IS_NOT_EXIST = '目标目录的父容器不存在',
  DIR_AND_DATABASE_IS_NOT_SYNC = '数据库与目录不同步',

  /**
   * 写入数据库状态码
   */
  DATA_WRITE_FAIL = '写入数据库失败',
  DATA_READ_FAIL = '读取数据库失败',
  DATA_READ_SUCCESS = '读取数据库成功',
  DATA_WRITE_SUCCESS = '写入数据库成功',
  DATA_UNKNOW_ERROR = '数据库发生未知错误',

  /**
   * 删除状态码
   */
  DELETE_TARGET_IS_FILE = '删除的目标不是目录，而是文件',
  DELETE_PATH_IS_NOT_EXIST = '删除的目录不存在'
}