import { InfusionContext } from '../../domain/infusion-context';
import { InfusionRequestHandler } from './infusion-request-handler';
import { Log } from '../../../logger';

export class InfusionProxyRequestHandler {
 
  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }

  public handle(proxyReq : any, req : any, res : any) {
    this.log.debug(`InfusionProxyRequestHandler.handle`);
    // tslint:disable-next-line:triple-equals
    let context = (req.context == null) ? new InfusionContext(this.log) : req.context;
    context.request.body = '';    
    this.setupRequestHandler(req,context);
  }

  private setupRequestHandler(req : any, context : InfusionContext) {
    let reqHandler = new InfusionRequestHandler(this.log,req,context);
    req.on('data',(chunk) => { reqHandler.onData(chunk); })
    req.on('end',() => reqHandler.onEnd());
  }

  
}