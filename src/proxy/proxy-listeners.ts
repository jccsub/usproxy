
import {
  ProxyListener, 
  ErrorProxyListener, 
  ParseProxyListener, 
  RedirectProxyListener, 
  RequestProxyListener, 
  ResponseProxyListener,
  ResponseSelectAndReplace
} from './proxy-listener';

import {ProxyContext} from './proxy-context';
import {Log} from '../logger';
import * as http from 'http';

var httpProxy = require('http-proxy');

export class ProxyListeners {

  public readonly errorProxyListeners : Array<ErrorProxyListener> = [];
  public readonly parseProxyListeners : Array<ParseProxyListener> = [];
  public readonly redirectProxyListeners : Array<RedirectProxyListener> = [];
  public readonly requestProxyListeners : Array<RequestProxyListener> = [];
  public readonly responseProxyListeners : Array<ResponseProxyListener> = [];
  public readonly responseSelectAndReplace : Array<ResponseSelectAndReplace> = [];
  private log : Log;
  

  constructor(logger : Log ) {
    this.log = logger;
    this.log.debug(`ProxyListeners.constructor(${logger})`);
  }

  public addListener(proxyListener : ErrorProxyListener |  ParseProxyListener | RedirectProxyListener | RequestProxyListener | ResponseProxyListener) {
    this.log.debug(`ProxyListeners.addListener(${typeof proxyListener})`);
    if (proxyListener instanceof ErrorProxyListener) {
      this.addErrorListener(proxyListener);
    }
    else 
    if (proxyListener instanceof ParseProxyListener) {
      this.addParseListener(proxyListener);
    }
    else 
    if (proxyListener instanceof RedirectProxyListener) {
      this.addRedirectListener(proxyListener);
    }
    else 
    if (proxyListener instanceof RequestProxyListener) {
      this.addRequestListener(proxyListener);
    }
    else 
    if (proxyListener instanceof ResponseProxyListener) {
      this.addResponseListener(proxyListener);
    }
    else 
      throw new Error(`Could not determine kind of load proxy listener`);
  } 
    
 
  private addErrorListener(listener: ErrorProxyListener) {
    this.errorProxyListeners.push(listener);
  }

  private addParseListener(listener: ParseProxyListener) {
    this.parseProxyListeners.push(listener);
  }

  private addRedirectListener(listener : RedirectProxyListener) {
    this.redirectProxyListeners.push(listener);
  }

  private addRequestListener(listener: RequestProxyListener) {
    this.requestProxyListeners.push(listener);
  }

  private addResponseListener(listener: ResponseProxyListener) {
    this.responseProxyListeners.push(listener);
  }  

  public addResponseSelectAndReplace(cssSelect : string, replaceString : string)  {
    this.responseSelectAndReplace.push(new ResponseSelectAndReplace(cssSelect,replaceString));
  }

}