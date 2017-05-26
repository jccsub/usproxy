import { RequestParser } from './request-parser';
import { Log } from '../logger';
import { ProxyContext } from '../proxy/proxy-context';
import { ProxyListener } from '../proxy/proxy-listener';

import * as body from 'body';


export class ContextMapperProxyRequestListener implements ProxyListener {
  private log : Log;
  private parser : RequestParser;

  constructor(parser : RequestParser, log: Log) {
    this.log = log;
    this.parser = parser;
  }

  public handleEvent(logger: Log, context: ProxyContext | Error): void {
    this.log.debug(`ContextMapperProxyRequestListener.handleEvent`);
    let proxyContext = context as ProxyContext;
    if (proxyContext.request.body) {
      let parsedBody = this.parse(proxyContext.request.body);
      this.log.debug(`ContextMapperProxyRequestListener.handleEvent - body = ${proxyContext.request.body}`);      
      proxyContext.dataMap.addContent(parsedBody);      
    }
  }

  private parse(body : string) : any {
    return this.parser.parse(body);
  }

}