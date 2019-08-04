import {Content} from "../model/bo/Content";
import {RequestResult} from "../model/dto/RequestResult";

export interface ContentService {
  addContent(content: Content): Promise<RequestResult>;

  searchAllChildContent(content: Content): Promise<RequestResult>;

  deleteContent(content: Content): Promise<RequestResult>;

  renameContent(content: Content): Promise<RequestResult>;

  getPath(content: Content): Promise<string>;
}