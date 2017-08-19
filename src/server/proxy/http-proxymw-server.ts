import { ResponseSelectAndReplace, ResponseSelectAndReplaceFactory } from './response-select-and-replace';
import { ProxyEventEmitter } from './proxy-event-emitter';
import { Log } from '../../logger';
import { Application } from '../../server/application';
import { WebServer } from '../../server/web-server';
import { ProxyContext } from './proxy-context';
import { ProxyListener } from './proxy-listener';
import { ProxyListenerCollection } from './proxy-listener-collection';
import { ProxyOptions } from './proxy-options';
import { ProxyServer } from './proxy-server';
import { listeners } from 'cluster';
import * as proxy from 'http-proxy-middleware';
import { log } from 'util';
import { ProxyContextPersistor } from "./proxy-context-persistor";
import {guarded,notNull} from '../../utils/guards';




export class HttpProxyMiddlewareServer implements ProxyServer {
  private log : Log;
  private listeners : ProxyListenerCollection;
  private app : Application;
  private webServer : WebServer;
  private proxyOptions : ProxyOptions;
  private proxyEventEmitter  : ProxyEventEmitter;
  private selectAndReplaceFactory : ResponseSelectAndReplaceFactory;
  constructor(
    proxyEventEmitter: ProxyEventEmitter, 
    webServer : WebServer, 
    app : Application, 
    selectAndReplaceFactory: ResponseSelectAndReplaceFactory, 
    log: Log) {
    this.log = log;    
    this.listeners = new ProxyListenerCollection(log);
    this.app = app;
    this.webServer = webServer;
    this.proxyEventEmitter = proxyEventEmitter;
    this.selectAndReplaceFactory = selectAndReplaceFactory;
  }

  private initializeContextIfNotInitialized(req : any) : ProxyContext {
    // tslint:disable-next-line:triple-equals
    if (req.context == null) {
      req.context = new ProxyContext(this.log);
    }
    return req.context;
  }

  private executeProxyReqHandlers(proxyReq, req, res) {
    let context = this.initializeContextIfNotInitialized(req);
    context.request.body = '';
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
        listener.handleEvent(context);
      });
    });
  }

  private executeProxyResHandlers(proxyRes,req,res) {
    let dataAvailable = false;
    let context = ((req as any).context as ProxyContext);

    // tslint:disable-next-line:triple-equals
    if (context == null) {
      throw new Error('HttpProxyMiddlewareServer.executeProxyResHandlers - req.context cannot be null');
    }

    this.executeSelectAndReplaceHandlers(req, res);

    let selectAndReplacer = this.selectAndReplaceFactory.create(this.log);
    selectAndReplacer.addSelectAndReplaceItems(context.htmlModifications);
    selectAndReplacer.execute(req, res)
    proxyRes.on('data', (chunk) => {
      context.response.body += chunk.toString('utf8');      
    });
    proxyRes.on('end', () => {
      context.response.headers = proxyRes.headers;
      context.response.statusCode = proxyRes.statusCode;                     
      this.listeners.responseProxyListeners.forEach((listener) => {
        listener.handleEvent(context);
      });
    
    });   
  }

  private executeErrorHandlers(err,req,res) {
    this.listeners.errorProxyListeners.forEach((listener) => {
        // tslint:disable-next-line:triple-equals
        if (req != null) {
          (req as any).context.error = err;
          listener.handleEvent((req as any).context);          
        }
        else {
          listener.handleEvent(err);        
        }
    });
  }

  private executeSelectAndReplaceHandlers(req, res) {
    let context = ((req as any).context as ProxyContext);
    this.listeners.selectAndReplaceListeners.forEach((listener) => {
      listener.handleEvent(context);
    });
  }

  private executePathRewriteHandlers(req) {
    let context = this.initializeContextIfNotInitialized(req);
    // tslint:disable-next-line:triple-equals
    this.listeners.pathRewriteListeners.forEach((listener) => {
      listener.handleEvent(context);
    });
  }

  public addErrorListener(proxyListener: ProxyListener) {
    this.listeners.addErrorListener(proxyListener);
  }

  public addRequestListener(listener: ProxyListener) {
    this.listeners.addRequestListener(listener);
  }

  public addResponseListener(listener: ProxyListener) {
    this.listeners.addResponseListener(listener);
  }  


  public addSelectAndReplaceListener(listener : ProxyListener) {
    this.listeners.addSelectAndReplaceListener(listener);
  }
  
  public addPathRewriteListener(listener : ProxyListener) {
    this.listeners.addPathRewriteListener(listener);
  }

  @guarded
  listen(@notNull port: number) {
    let x = 0;
    this.proxyEventEmitter.on('error', (err, req, res) => {this.executeErrorHandlers(err,req,res)} );
    this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => {this.executeProxyResHandlers(proxyRes, req, res)} );
    this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res)} );
    this.proxyEventEmitter.on('pathRewrite', (req) => { this.executePathRewriteHandlers(req);  (req as any).newPath = (req as any).context.rewritePath; } )
    this.app.use(this.proxyEventEmitter.getRequestListener());
    this.webServer.startServer(port, this.app.requestListener);
  }

}