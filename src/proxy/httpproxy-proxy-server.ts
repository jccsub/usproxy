import {ProxyServer} from './proxy-server';

import {
  ProxyListener, 
  ErrorProxyListener, 
  ParseProxyListener, 
  RedirectProxyListener, 
  RequestProxyListener, 
  ResponseProxyListener,
  ResponseSelectAndReplace
} from './proxy-listener';

import {ProxyListeners} from './proxy-listeners';
import * as httpProxy from 'http-proxy';
import {WebServer} from '../webserver/web-server'
import {ProxyContext} from './proxy-context';
import {Log} from '../logger';
import * as http from 'http';

//var httpProxy = require('http-proxy');

var connect = require('connect');

export class HttpProxyProxyServer implements ProxyServer {
  private webServer : WebServer;
  private proxy : any;
  private listeners : ProxyListeners;
  private target : string;
  private selectAndReplace : any = [];
  private log : Log;
  

  constructor(webserver : WebServer, target : string, listeners : ProxyListeners, log : Log) {
    this.webServer = webserver;
    this.listeners = listeners;
    this.target = target;
    this.log = log;
    this.log.debug(`Setting up proxy for ${target}`) ;    
    this.proxy = httpProxy.createProxyServer({target:this.target});
  }

  public listen(port : number) {
    this.setupResponseSearchAndReplace();
    this.setupErrorListeners();
    this.setupRequestListers();
    this.setupResponseListeners();
    this.setupMiddleware();    
    this.log.debug(`HttpProxyProxyServer listening on port ${port}`);
    this.webServer.use(require('harmon')([],this.selectAndReplace));
    this.webServer.use((req, res) => {
      this.proxy.web(req,res);
    });
    this.webServer.listen(port);
  }  

  private setupErrorListeners() {
    this.listeners.errorProxyListeners.forEach((listener) => {
      this.proxy.on('error',(error, req , res , next ) => {        
        this.log.error(`Error proxy listener: ${error.message}`);
        if ((req as any) != null)
          listener.handleEvent(this.log,(req as any).context);
      });
    });
  }

  private setupRequestListers() {
    this.proxy.on('proxyReq',(proxyReq , req , res )=> {
      req.setEncoding(null);
      this.log.debug('proxy.on("proxyReq")');
      let context = new ProxyContext();
      context.request.body = '';
      (req as any).context = context;
      let dataAvailable = false;
      req.on('data',(chunk) => {
        this.log.debug('proxyReq.on("data")');
        dataAvailable = true;
        context.request.body += chunk;

      });
      req.on('end',() => {
        this.log.debug('proxyReq.on("end"');
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
      this.proxy.on('proxyRes',(proxyRes, req, res) => {     
        this.log.debug('proxy.on("proxyRes")');
        let context = ((req as any).context as ProxyContext);
        let dataAvailable = false;
        proxyRes.on('data', (chunk) => {
          this.log.debug('proxyRes.on("data")');
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
    this.listeners.responseSelectAndReplace.forEach(selectAndReplaceItem=>{
      let item : any = {};
      item.query = selectAndReplaceItem.cssSelectString;
      item.func = function(node) {node.createWriteStream().end(selectAndReplaceItem.replaceString);}
      this.selectAndReplace.push(item);
    });   
  }

  private setupMiddleware() {
    this.webServer.use(require('harmon')([],this.selectAndReplace));
    this.webServer.use((req,res)=>{this.proxy.web(req,res)});
  }
 
}