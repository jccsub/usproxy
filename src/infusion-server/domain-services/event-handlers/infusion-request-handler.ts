import { InfusionContext } from '../../domain/infusion-context';
import { Log } from '../../../logger';

export class InfusionRequestHandler {

  private log : Log;
  private context : InfusionContext;
  private dataAvailable : boolean = false;

  private req : any;

  constructor(log : Log, req : any, context : InfusionContext) {
    this.log = log;
    this.req = req;
    this.context = context;
    this.context.request.body = '';
  }

  public onData(chunk : any) {
    this.log.debug(`InfusionRequestHandler.onData`);    
    this.dataAvailable = true;
    this.context.request.body += chunk;
  }

  public onEnd() {
    this.log.debug(`InfusionRequestHandler.onEnd`);
    this.populateContextWithReq(this.context, this.req)    
  }
   private getCookiesFromRequest(req : any) : Map<string,string> {
    try {
      let cookieMap = new Map<string,string>();
      req.headers['cookie'].split(';').forEach(element => {
        let keyValuePair = element.split('=');
        cookieMap[keyValuePair[0].trim()] = keyValuePair[1].trim();
      });      
      return cookieMap;
    }
    catch(exception) {
      return new Map<string,string>();
    }
  }

  private populateContextWithReq(context : InfusionContext, req : any) {
    this.context.request.url = this.req.url;
    this.context.request.host = this.req.headers.host;
    this.context.request.protocol = (this.req.connection.encrypted) ? 'https' : 'http';
    this.context.request.method = this.req.method;
    let cookieMap = this.getCookiesFromRequest(req);
    this.context.request.sessionId = cookieMap['ASP.NET_SessionId'];
    //this.print(this.req.headers);   
  }
}