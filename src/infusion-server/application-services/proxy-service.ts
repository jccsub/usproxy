import { InfusionContextWriter } from '../domain-services/infusion-context-writer';
import { InfusionContext, InfusionContextDirection } from '../domain/infusion-context';
import * as events from 'events';
import { MarkupModifier } from './markup-modifier';
import { InfusionConfiguration } from '../domain/infusion-configuration';
import { ModificationQueryFunction } from '../domain/infusion-modification';
import { InfusionProxyRequestHandler } from '../domain-services/event-handlers/infusion-proxy-request-handler';
import { InfusionProxyResponseHandler } from '../domain-services/event-handlers/infusion-proxy-response-handler';
import { InfusionErrorHandler } from '../domain-services/event-handlers/infusion-error-handler';
import { InfusionPathRewriteHandler } from '../domain-services/event-handlers/infusion-path-rewrite-handler';
import * as http from 'http';
import { SSL_OP_SINGLE_DH_USE } from 'constants';
import { Packet } from '_debugger';
import { Log } from '../../logger';
import * as proxy from 'http-proxy-middleware';
import * as connect from 'connect';

export class ProxyService extends events.EventEmitter{
  private markupModifier: MarkupModifier;
  private log: Log;
  private proxy : any;  
  private connectApp;
  private configuration : InfusionConfiguration;
  private writer : InfusionContextWriter;
  
  constructor(log : Log, markupModifier : MarkupModifier, writer : InfusionContextWriter, configuration : InfusionConfiguration) {
    super();
    this.log = log;
    this.writer = writer;
    this.configuration = configuration;
    this.connectApp = connect();
    this.markupModifier = markupModifier;
  }

  public listen(target : string, port : number) {    
    this.proxy = this.createProxyServer(target);    
    this.connectApp.use(this.proxy);
    this.log.info(`ProxyService.listen(target: ${target}, port: ${port})`);
    http.createServer(this.connectApp).listen(port);
  }

  private createProxyServer(target : string) {
    return proxy('/', {
      target : target,
   //   changeOrigin : true,
      agent : new http.Agent({keepAlive: true}),
      logLevel : this.log.level,
      pathRewrite: (path,req) => {
        this.log.debug(`ProxyService.setupProxyService.pathRewrite, path=${path}`);
        (req as any).newPath = '';
        new InfusionPathRewriteHandler(this.log).handle(path, req);
        if (req.newPath) {
          this.log.debug(`ProxyService.setupProxyService.pathRewrite - newPath=${req.newPath}`);          
          return req.newPath;
        }
      },
      onError : (err, req, res) => {this.log.debug(`onError`); new InfusionErrorHandler(this.log).handle(err, req, res); },
      onProxyRes : (proxyRes,req,res) => { 
        this.log.debug(`onProxyRes`);
        this.markupModifier.performModifications(((req as any).context as InfusionContext).request.fullUrl, req, res);
        new InfusionProxyResponseHandler(this.log).handle(proxyRes, req, res);
        ((req  as any).context as InfusionContext).direction = InfusionContextDirection.Response;
        //this.emit('context', req.context);
        this.writer.write((req  as any).context as InfusionContext);
        this.log.debug(((req  as any).context as InfusionContext).toString());
      },
      onProxyReq : (proxyReq, req, res) => { 
        this.log.debug(`onProxyReq`);
        new InfusionProxyRequestHandler(this.log).handle(proxyReq, req, res);
        (req.context as InfusionContext).direction = InfusionContextDirection.Request;
        //this.emit('context', req.context);
      }
    });
  }

}