
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
    result += '\n---------------------------------------'
    result += '\ncontext = {\n';
    if (this.error != null)   
      result += `\n\terror-message: ${this.error.message}`;
    result += `\n\trequest-body: ${this.request.body}`;
    result += `\n\trequest-url: ${this.request.fullUrl}`;
    result += `\n\trequest-method: ${this.request.method}`;
    result += `\n\tresponse-headers: ${JSON.stringify(this.response.headers)}`;
    result += `\n\tdataMap:`;
    if (this.dataMap != null)   
      result += `\n${this.dataMap.toString()}`;
    result += '\n---------------------------------------'
    return result;
  }

  

}