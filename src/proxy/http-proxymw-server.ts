
import {ProxyServer} from './proxy-server';
import {Log} from '../logger';
import {ProxyListenerCollection} from './proxy-listener-collection';
import {ProxyListener} from './proxy-listener';
import {ProxyContext} from './proxy-context';
import * as proxy from 'http-proxy-middleware';

import * as connect from 'connect';
import * as http from 'http';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';

export class HttpProxyMiddlewareServer implements ProxyServer {
  
  private log : Log;
  private listeners : ProxyListenerCollection;
  private proxyOptions : any;
  private app : any;
  private proxy : any;

  constructor(log: Log) {
    this.log = log;
    this.app = connect();
  }

  private executeProxyReqHandlers(proxyReq, req, res) {
    let context = new ProxyContext();
    context.request.body = '';
    (req as any).context = context;
    let dataAvailable = false;
    req.on('data',(chunk) => {
      dataAvailable = true;
      context.request.body += chunk;
    });
    req.on('end',() => {
      context.request.url = req.url;
      context.request.host = req.headers.host;
      context.request.protocol = 'http';
      context.request.method = req.method;
      this.listeners.requestProxyListeners.forEach((listener) => {
        listener.handleEvent(this.log, context);
      });
    });
  }

  private executeProxyResHandlers(proxyRes,req,res) {
    let context = ((req as any).context as ProxyContext);
    let dataAvailable = false;
    proxyRes.on('data', (chunk) => {
      context.response.body += chunk.toString('utf8');
    });
    proxyRes.on('end', () => {
      context.response.headers = proxyRes.headers;
      context.response.statusCode = proxyRes.statusCode;                     
      this.listeners.responseProxyListeners.forEach((listener) => {
        listener.handleEvent(this.log, context);
      });
    });   
  }

  private executeErrorHandlers(err,req,res) {
    this.listeners.errorProxyListeners.forEach((listener) => {
        if ((req as any) != null) {
          (req as any).context.error = err;
          listener.handleEvent(this.log,(req as any).context);          
        }
        else
          listener.handleEvent(this.log,err);        
    });
  }


  public addErrorListener(proxyListener: ProxyListener) {
    this.listeners.addErrorListener(proxyListener);
  }

  public addParseListener(listener: ProxyListener) {
    this.listeners.addParseListener(listener);
  }

  public addRedirectListener(listener : ProxyListener) {
    this.listeners.addRedirectListener(listener);
  }

  public addRequestListener(listener: ProxyListener) {
    this.listeners.addRequestListener(listener);
  }

  public addResponseListener(listener: ProxyListener) {
    this.listeners.addResponseListener(listener);
  }  

  public addResponseSelectAndReplace(cssSelect : string, replaceString : string)  {
    this.listeners.addResponseSelectAndReplace(cssSelect,replaceString);
  }

  listen(port: number, target : string) {
    this.proxy = proxy({
      target: target,
      changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
      logLevel: 'debug',
      onError : (err,req,res) => { this.executeErrorHandlers(err,req,res); },
      onProxyRes : (proxyRes,req,res) => { this.executeProxyResHandlers(proxyRes,req,res)},
      onProxyReq : (proxyReq,req,res) => { this.executeProxyReqHandlers(proxyReq,req,res)},
    });    
    http.createServer(this.app).listen(port);
  }

}