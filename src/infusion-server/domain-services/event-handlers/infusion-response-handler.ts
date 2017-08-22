import { InfusionContext } from '../../domain/infusion-context';
import { Log } from '../../../logger';


export class InfusionResponseHandler {

  log : Log;
  context : InfusionContext;
  proxyRes : any;


  constructor(log : Log, context : InfusionContext, proxyRes : any) {
    this.log = log;
    this.context = context;
    this.proxyRes = proxyRes;
  }

  public onData(chunk : any) {
    this.log.debug(`InfusionResponseHandler.onData`);
    this.context.response.body += chunk.toString('utf8');
  }

  public onEnd() {
    this.log.debug(`InfusionResponseHandler.onEnd`);
    this.context.response.statusCode = this.proxyRes.statusCode;    
    this.context.response.headers = this.proxyRes.headers;
  }

}