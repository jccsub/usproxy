import {ProxyServer} from './proxy-server';

import {
  ProxyListener, 
  ResponseSelectAndReplace
} from './proxy-listener';

import {ProxyListeners} from './proxy-listeners';
import {WebServer} from '../webserver/web-server'
import {ProxyContext} from './proxy-context';
import {Log} from '../logger';
import * as http from 'http';
import {ProxyEventEmitter} from './proxy-event-emitter';
import harmon = require('harmon');

var connect = require('connect');

export class HttpProxyProxyServer implements ProxyServer {

  private webServer : WebServer;
  private proxy : ProxyEventEmitter;
  private listeners : ProxyListeners;
  private target : string;
  private selectAndReplace : any = [];
  private log : Log;
  

  constructor(proxyEventEmitter : ProxyEventEmitter, webserver : WebServer,  log : Log) {
    this.webServer = webserver;
    this.listeners = new ProxyListeners(log);
    this.log = log;
    this.proxy = proxyEventEmitter;
  }

  public listen(port : number) {
    this.setupResponseSearchAndReplace();
    this.setupErrorListeners();
    this.setupRequestListeners();
    this.setupResponseListeners();
    this.setupMiddleware();    
    this.log.debug(`HttpProxyProxyServer listening on port ${port}`);
    this.webServer.use(require('harmon')([],this.selectAndReplace));
    this.webServer.use((req, res) => {
      this.proxy.web(req,res);
    });
    this.webServer.listen(port);
  }  

  public addErrorListener(proxyListener: ProxyListener) {
    this.listeners.addErrorListener(proxyListener);
  }

  public addParseListener(listener: ProxyListener) {
    this.listeners.addErrorListener(listener);
  }

  public addRedirectListener(listener : ProxyListener) {
    this.listeners.addErrorListener(listener);
  }

  public addRequestListener(listener: ProxyListener) {
    this.listeners.addErrorListener(listener);
  }

  public addResponseListener(listener: ProxyListener) {
    this.listeners.addErrorListener(listener);
  }  

  public addResponseSelectAndReplace(cssSelect : string, replaceString : string)  {
    this.listeners.addResponseSelectAndReplace(cssSelect,replaceString);
  }


  private setupErrorListeners() {
    this.log.debug('setupErrorListeners')
    this.listeners.errorProxyListeners.forEach((listener) => {
      this.proxy.on('error',(error, req , res , next ) => {        
        this.log.error(`Error proxy listener: ${error.message}`);
        if ((req as any) != null) {
          (req as any).context.error = error;
          listener.handleEvent(this.log,(req as any).context);          
        }
        else
          listener.handleEvent(this.log,error);        
      });
    });
  }

  private setupRequestListeners() {
    this.log.debug('setupRequestListeners')
    this.proxy.on('proxyReq',(proxyReq , req , res )=> {
      this.log.debug('proxy.on(proxyReq)');
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
    });
  }

  private setupResponseListeners() {
    this.log.debug('setupResponseListeners')
      this.proxy.on('proxyRes',(proxyRes, req, res) => {     
        this.log.debug('proxy.on("proxyRes")');
        let context = ((req as any).context as ProxyContext);
        let dataAvailable = false;
        proxyRes.on('data', (chunk) => {
          context.response.body += chunk.toString('utf8');
        });
        proxyRes.on('end', () => {
          this.log.debug('proxyRes.on("end")');
          context.response.headers = proxyRes.headers;
          context.response.statusCode = proxyRes.statusCode;                     
          this.listeners.responseProxyListeners.forEach((listener) => {
            listener.handleEvent(this.log, context);
          });
        });
      });
  }

  private setupResponseSearchAndReplace() {    
    this.log.debug('setupResponseSearchAndReplace')
    this.listeners.responseSelectAndReplace.forEach(selectAndReplaceItem=>{
      let item : any = {};
      item.query = selectAndReplaceItem.cssSelectString;
      item.func = (node) => {
        node.createWriteStream().end(selectAndReplaceItem.replaceString);
      }
      this.selectAndReplace.push(item);
    });   
  }

  private setupMiddleware() {
    this.webServer.use(harmon([],this.selectAndReplace));
    this.webServer.use((req,res)=>{this.proxy.web(req,res)});
  }
 
}