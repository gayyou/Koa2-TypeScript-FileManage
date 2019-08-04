import { User } from "../../model/bo/User";

export interface UserDao {
  addAccount(user: User): Promise<boolean>;

  searchAccount(user: User): Promise<any>;

  searchAccountPwd(user: User): Promise<any>;

  changePassword(user: User): Promise<any>;
}