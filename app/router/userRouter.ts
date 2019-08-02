// 这里是将用户的路径转为本系统的文件路径，键为访问的路径，值为在本系统的路径（相对于controller的路径），并且最后一个为controller所调用的方法

export const userRouter = {
  '/user/login': 'User/UserController/login'
}