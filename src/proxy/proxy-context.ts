import { DataMap } from '../mapper/data-map';
import { HtmlModification } from './response-select-and-replace';
import { ProxyRequest } from './proxy-request';
import { ProxyResponse } from './proxy-response';
export interface ProxyContext {
  response : ProxyResponse;

  request : ProxyRequest;

  htmlModifications : Array<HtmlModification>;

  rewritePath : string;

  error : Error;

  dataMap : DataMap;

  toString();
  
}
