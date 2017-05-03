
import {ProxyListener} from './proxy-listener';
import {StreamingHtmlMiddleware,SelectAndReplaceItem} from '../utils/streaming-html-middleware';
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
  public readonly responseSelectAndReplace : Array<SelectAndReplaceItem> = [];
  private log : Log;
  

  constructor(logger : Log ) {
    this.log = logger;
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
    this.log.debug(`adding ${cssSelect}`);
    this.responseSelectAndReplace.push(new SelectAndReplaceItem(cssSelect,replaceString));
  }

}