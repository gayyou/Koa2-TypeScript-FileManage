export class User {
  constructor(options: any) {
    ({ account: this.account, password: this.password, permission: this.permission, rootId: this.rootId } = options)
  }
  account: string;
  password: string;
  permission: number;
  rootId: number;
}