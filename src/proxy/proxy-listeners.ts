
import {
  ProxyListener, 
  ResponseSelectAndReplace
} from './proxy-listener';

import {ProxyContext} from './proxy-context';
import {Log} from '../logger';
import * as http from 'http';

var httpProxy = require('http-proxy');

export class ProxyListeners {

  public readonly errorProxyListeners : Array<ProxyListener> = [];
  public readonly parseProxyListeners : Array<ProxyListener> = [];
  public readonly redirectProxyListeners : Array<ProxyListener> = [];
  public readonly requestProxyListeners : Array<ProxyListener> = [];
  public readonly responseProxyListeners : Array<ProxyListener> = [];
  public readonly responseSelectAndReplace : Array<ResponseSelectAndReplace> = [];
  private log : Log;
  

  constructor(logger : Log ) {
    this.log = logger;
    this.log.debug(`ProxyListeners.constructor(${logger})`);
  }


  public addErrorListener(listener: ProxyListener) {
    this.errorProxyListeners.push(listener);
  }

  public addParseListener(listener: ProxyListener) {
    this.parseProxyListeners.push(listener);
  }

  public addRedirectListener(listener : ProxyListener) {
    this.redirectProxyListeners.push(listener);
  }

  public addRequestListener(listener: ProxyListener) {
    this.requestProxyListeners.push(listener);
  }

  public addResponseListener(listener: ProxyListener) {
    this.responseProxyListeners.push(listener);
  }  

  public addResponseSelectAndReplace(cssSelect : string, replaceString : string)  {
    this.responseSelectAndReplace.push(new ResponseSelectAndReplace(cssSelect,replaceString));
  }

}