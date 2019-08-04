import {User} from "../model/bo/User";

export interface UserService {
  login(user: User): Promise<any>;

  regist(user: User): Promise<any>;
}