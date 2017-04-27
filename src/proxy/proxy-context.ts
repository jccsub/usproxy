
import * as http from 'http';
import {DataMap} from './data-map';
import {ProxyRequest} from './proxy-request';
import {ProxyResponse} from './proxy-response';

export class ProxyContext {

  public response : ProxyResponse = new ProxyResponse();

  public request : ProxyRequest = new ProxyRequest();

  public error : Error;

  public dataMap : DataMap = new DataMap();

  public toString() {
    let result ='';
    result += '---------------------------------------'
    result += 'context = {\n';
    if (this.error != null)   
      result += `\terror: ${this.error.message}`;
    result += `\tresponse: ${this.response}`;
    result += `\trequest: ${this.request}`;
    result += `\tresponse: ${this.response}`;
    result += `\tresponse: ${this.response}`;
    result += `\tdataMap:`;
    if (this.dataMap != null)   
      result += `${this.dataMap.toString()}`;
    result += '---------------------------------------'
    return result;
  }

  

}