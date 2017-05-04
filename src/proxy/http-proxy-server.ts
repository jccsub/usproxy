import {ProxyServer} from './proxy-server';
import {ProxyListener} from './proxy-listener';
import {ProxyListenerCollection} from './proxy-listener-collection';
import {WebServer} from '../webserver/web-server'
import {ProxyContext} from './proxy-context';
import {Log} from '../logger';
import {ProxyEventEmitter} from './proxy-event-emitter';
import {StreamingHtmlMiddleware,SelectAndReplaceItem} from '../utils/streaming-html-middleware';

export class HttpProxyServer implements ProxyServer {

  private webServer : WebServer;
  private proxy : ProxyEventEmitter;
  private listeners : ProxyListenerCollection;
  private target : string;
  private selectAndReplace : any = [];
  private log : Log;
  private streamingHtmlMiddleware : StreamingHtmlMiddleware;
  

  constructor(
    proxyEventEmitter : ProxyEventEmitter, 
    webserver : WebServer, 
    streamingHtmlMiddleware : StreamingHtmlMiddleware , 
    log : Log) {
    this.webServer = webserver;
    this.log = log;
    this.listeners = new ProxyListenerCollection(log);
    this.proxy = proxyEventEmitter;
    this.streamingHtmlMiddleware = streamingHtmlMiddleware;
  }

  public listen(port : number) {
    this.setupErrorListeners();
    this.setupRequestListeners();
    this.setupResponseListeners();
    this.setupMiddleware();    
    this.webServer.use(require('harmon')([],this.selectAndReplace));
    this.webServer.listen(port);
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

  private setupErrorListeners() {
    this.listeners.errorProxyListeners.forEach((listener) => {
      this.proxy.on('error',(error, req , res , next ) => {        
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
    this.proxy.on('proxyReq',(proxyReq , req , res )=> {
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
      this.proxy.on('proxyRes',(proxyRes, req, res) => {     
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
      });
  }

  private setupMiddleware() {
    this.streamingHtmlMiddleware.selectAndReplaceItems = this.streamingHtmlMiddleware.selectAndReplaceItems.concat(this.listeners.responseSelectAndReplace);
    this.webServer.use(this.streamingHtmlMiddleware.selectAndReplaceCallback);    
    this.webServer.use((req,res)=>{this.proxy.web(req,res)});
  }
 
}