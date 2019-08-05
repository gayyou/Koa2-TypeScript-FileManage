import { Content } from "../../model/bo/Content";

export interface ContentDao {
  addContent(content: Content): Promise<any>;

  changeContent(content: Content): Promise<any>;

  searchContent(content: Content): Promise<any>;

  removeContent(contentList: Array<Content>): Promise<any>;

  searchChildrenListById(content: Content): Promise<Array<any>>;

  searchChildContent(content: Content): Promise<any>;
}