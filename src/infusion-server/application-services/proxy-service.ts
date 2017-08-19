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

export class ProxyService {
  private markupModifier: MarkupModifier;
  private log: Log;
  private proxy : any;  
  private connectApp;

  private configuration : InfusionConfiguration;
  
  constructor(log : Log, markupModifier : MarkupModifier, configuration : InfusionConfiguration) {
    this.log = log;
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
      changeOrigin : true,
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
      onError : (err, req, res) => { new InfusionErrorHandler(this.log).handle(err, req, res); },
      onProxyRes : (proxyRes,req,res) => { 
        this.markupModifier.performModifications(req, res);
        new InfusionProxyResponseHandler(this.log).handle(proxyRes, req, res);
      },
      onProxyReq : (proxyReq, req, res) => { new InfusionProxyRequestHandler(this.log).handle(proxyReq, req, res);}
    });
  }

}