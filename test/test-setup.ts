import { ProxyContext } from '../src/proxy/proxy-context';
import { UriRequestParser } from '../src/mapper/uri-request-parser';

import { DataMapper } from '../src/mapper/context-mapper';
import { TestProxyPersistor } from './test-proxy-persistor';
import { HttpWebserver } from '../src/server/http-web-server';
import { ConnectApplication } from '../src/server/connect-application';
import { HttpProxyMiddlewareServer } from '../src/proxy/http-proxymw-server';
import { ProxyMWEventEmitter } from '../src/proxy/http-proxy-mw-event-emitter';
import { HarmonResponseSelectAndReplaceFactory } from '../src/proxy/harmon-response-select-and-replace';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import { read, readdir, readdirSync } from 'fs';
import { ProxyListener } from '../src/proxy/proxy-listener';


class ContextLogger implements ProxyListener {

  log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  public handleEvent(logger: Log, context: ProxyContext | Error): void {
    if (context != null) {
      this.log.debug(context.toString());
    }
  }
}

export class TestSetup {

  protected readonly errorListeners : Array<ProxyListener>;
  protected readonly parseListeners : Array<ProxyListener>;
  protected readonly redirectListeners : Array<ProxyListener>;
  protected readonly requestListeners : Array<ProxyListener>;
  protected readonly responseListeners : Array<ProxyListener>;
  protected readonly responseSelectAndReplaceListeners : Array<ProxyListener>;
  protected readonly target : string;
  protected readonly port : number;
  protected readonly log : Log;

  constructor(target : string, port : number) {
    this.errorListeners = new Array<ProxyListener>();
    this.parseListeners = new Array<ProxyListener>();
    this.redirectListeners = new Array<ProxyListener>();
    this.requestListeners = new Array<ProxyListener>();
    this.responseListeners = new Array<ProxyListener>();
    this.responseSelectAndReplaceListeners = new Array<ProxyListener>();
    this.target = target;
    this.port = port;
    this.log = new WinstonLog();
  }

  public startTest() {
    let proxyEventEmitter = new ProxyMWEventEmitter(this.target,this.log);
    let selectAndReplaceFactory = new HarmonResponseSelectAndReplaceFactory();
    let proxyServer = new HttpProxyMiddlewareServer(proxyEventEmitter, new HttpWebserver(), new ConnectApplication(), selectAndReplaceFactory, this.log );
    this.requestListeners.push(new DataMapper(new UriRequestParser(this.log),this.log));
    this.responseListeners.push(new ContextLogger(this.log));
    this.errorListeners.forEach((listener) => {proxyServer.addErrorListener(listener)});
    this.parseListeners.forEach((listener) => {proxyServer.addParseListener(listener)});
    this.redirectListeners.forEach((listener) => {proxyServer.addRedirectListener(listener)});
    this.requestListeners.forEach((listener) => {proxyServer.addRequestListener(listener)});
    this.responseListeners.forEach((listener) => {proxyServer.addResponseListener(listener)});
    this.responseSelectAndReplaceListeners.forEach((listener) => {proxyServer.addSelectAndReplaceListener(listener)});
    proxyServer.listen(this.port);
  }

}