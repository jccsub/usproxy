import { ResponseSelectAndReplace } from './response-select-and-replace';
import { ProxyEventEmitter } from './proxy-event-emitter';
import { Log } from '../logger';
import { Application } from '../server/application';
import { WebServer } from '../server/web-server';
import { HarmonStreamingHtmlMiddleware } from '../utils/harmon-streaming-html-middleware';
import { ProxyContext } from './proxy-context';
import { ProxyListener } from './proxy-listener';
import { ProxyListenerCollection } from './proxy-listener-collection';
import { ProxyOptions } from './proxy-options';
import { ProxyServer } from './proxy-server';
import { listeners } from 'cluster';
import * as proxy from 'http-proxy-middleware';
import { log } from 'util';



export class HttpProxyMiddlewareServer implements ProxyServer {
  
  private log : Log;
  private listeners : ProxyListenerCollection;
  private app : Application;
  private webServer : WebServer;
  private proxyOptions : ProxyOptions;
  private proxyEventEmitter  : ProxyEventEmitter;
  private selectAndReplacer : ResponseSelectAndReplace;

  constructor(proxyEventEmitter: ProxyEventEmitter, webServer : WebServer, app : Application, selectAndReplacer: ResponseSelectAndReplace, log: Log) {
    this.log = log;    
    this.listeners = new ProxyListenerCollection(log);
    this.app = app;
    this.webServer = webServer;
    this.proxyEventEmitter = proxyEventEmitter;
    this.selectAndReplacer = selectAndReplacer;
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

    var selects : any = [];
    var simpleselect : any = {};

    (simpleselect as any).query = '#ENDPOINTS';
    (simpleselect as any).func = function (node) {
        node.createWriteStream().end('<div>+ Trumpet</div>');
    }    

    selects.push(simpleselect);

    var x = require('harmon')([], selects);
    x(req,res,()=>{this.log.info('next would have been called')});


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
        // tslint:disable-next-line:triple-equals
        if ((req as any) != null) {
          (req as any).context.error = err;
          listener.handleEvent(this.log,(req as any).context);          
        }
        else {
          listener.handleEvent(this.log,err);        
        }
    });
  }

  private executeSelectAndReplaceHandlers(req, res) {
    let context = ((req as any).context as ProxyContext);
    // tslint:disable-next-line:triple-equals
    if (context != null) {
      this.listeners.selectAndReplaceListeners.forEach((listener) => {
        listener.handleEvent(this.log, context);
      });
    }
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


  public addSelectAndReplaceListener(listener : ProxyListener) {
    this.listeners.addSelectAndReplaceListener(listener);
  }
  

  public addResponseSelectAndReplace(cssSelect : string, replaceString : string)  {
    this.listeners.addResponseSelectAndReplace(cssSelect,replaceString);
  }

  listen(port: number) {
    let x = 0;
    this.proxyEventEmitter.on('error', (err, req, res) => {this.executeErrorHandlers(err,req,res)} );
    this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => {this.executeProxyResHandlers(proxyRes, req, res)} );
    this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => {this.executeProxyReqHandlers(proxyReq, req, res)} );


    this.app.use(this.proxyEventEmitter.getRequestListener());

//    this.app.use(harmon.selectAndReplaceCallback);
    this.webServer.startServer(port, this.app.requestListener);
  }

}