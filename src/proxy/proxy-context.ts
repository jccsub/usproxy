import { DataMap } from '../mapper/data-map';
import { SelectAndReplaceItem } from './response-select-and-replace';
import { ProxyRequest } from './proxy-request';
import { ProxyResponse } from './proxy-response';
export interface ProxyContext {
  response : ProxyResponse;

  request : ProxyRequest;

  selectAndReplaceItems : Array<SelectAndReplaceItem>;

  rewritePath : string;

  error : Error;

  dataMap : DataMap;

  toString();
  
}
