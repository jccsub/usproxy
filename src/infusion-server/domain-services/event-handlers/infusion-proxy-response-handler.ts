import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionResponseHandler } from './infusion-response-handler';
import { Log } from '../../../logger';

export class InfusionProxyResponseHandler {

  private log : Log;

  constructor(log : Log) {
    this.log = log;  
  }

  public handle(proxyRes : any, req : any, res : any) {
    this.log.debug(`InfusionProxyResponseHandler.handle`);

    let resHandler = new InfusionResponseHandler(this.log);    

    proxyRes.on('data',(chunk) => {
      resHandler.onData(chunk);
    });

    proxyRes.on('end',() => {
      resHandler.onEnd();
    });
  }


}