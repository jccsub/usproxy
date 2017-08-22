import { InfusionContext } from '../../domain/infusion-context';
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

    let context = ((req as any).context as InfusionContext);
    
    // tslint:disable-next-line:triple-equals
    if (context == null) {
      throw new Error('InfusionProxyResponseHandler.handle - req.context cannot be null');
    }
        

    let resHandler = new InfusionResponseHandler(this.log, context, proxyRes);    

    proxyRes.on('data',(chunk) => {      
      resHandler.onData(chunk);
    });

    proxyRes.on('end',() => {
      resHandler.onEnd();
    });
  }


}