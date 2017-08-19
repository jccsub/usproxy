import { guarded, notNull } from '../utils/guards';
import { RequestParser } from './request-parser';
import { Log } from '../logger';
import { ProxyContext } from '../server/proxy/proxy-context';
import { ProxyListener } from '../server/proxy/proxy-listener';

import * as body from 'body';


export class DataMapper implements ProxyListener {
  private log : Log;
  private parser : RequestParser;

  constructor(parser : RequestParser, log: Log) {
    this.log = log;
    this.parser = parser;
  }


  @guarded
  public handleEvent(@notNull context: ProxyContext ): void {
    
    let proxyContext = context as ProxyContext;
    if (proxyContext.request.body) {
      let parsedBody = this.parse(proxyContext.request.body);
      proxyContext.dataMap.addContent(parsedBody);      
    }
  }

  private parse(body : string) : any {
    return this.parser.parse(body);
  }

}