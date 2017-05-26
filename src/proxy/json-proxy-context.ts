import { ProxyContext } from './proxy-context';
import { JsonDataMap } from '../mapper/json-data-map';
import { Log } from '../logger';
import { HtmlModification } from './response-select-and-replace';
import * as http from 'http';
import {DataMap} from '../mapper/data-map';
import {ProxyRequest} from './proxy-request';
import {ProxyResponse} from './proxy-response';


export class JsonProxyContext implements ProxyContext {

  public response : ProxyResponse = new ProxyResponse();

  public request : ProxyRequest = new ProxyRequest();

  public htmlModifications : Array<HtmlModification> = new Array<HtmlModification>();

  public rewritePath : string = '';

  public error : Error;

  public dataMap : DataMap;

  private log : Log;
  constructor(log : Log) {
    this.log = log;
    this.dataMap = new JsonDataMap(log);
  }

  /* istanbul ignore next */
  public toString() {
    let result ='';
    result += '\n---------------------------------------'
    result += '\ncontext = {\n';
    // tslint:disable-next-line:triple-equals
    if (this.error != null) {  
      result += `\n\terror-message: ${this.error.message}`;
    }
    result += `\n\trequest-body: ${this.request.body}`;
    result += `\n\trequest-url: ${this.request.fullUrl}`;
    result += `\n\trequest-method: ${this.request.method}`;
    result += `\n\tresponse-headers: ${JSON.stringify(this.response.headers)}`;
    result += `\n\tdataMap:`;
    // tslint:disable-next-line:triple-equals
    if (this.dataMap != null) {   
      result += `\n${this.dataMap.toString()}`;
    }
    result += '\n---------------------------------------'
    return result;
  }

  

}