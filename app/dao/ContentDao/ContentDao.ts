import { Content } from "../../model/Content";

export interface ContentDao {
  addContent(content: Content): Promise<any>;

  changeContent(content: Content): Promise<any>;

  searchContent(content: Content): Promise<any>;

  removeContent(contentList: Array<Content>): Promise<any>;

  searchChildrenListById(content: Content): Promise<any>;
}