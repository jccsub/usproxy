import { ProxyResponse } from './proxy/proxy-response';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';


export interface ReqRes  {
  (req: IncomingMessage,res : ServerResponse) : void  
}

export interface ReqResNext {
  (req : IncomingMessage, res : ServerResponse, next? : Function) : void
}

export interface ErrReqRes {
  (err : Error, req : IncomingMessage, res : ServerResponse) : void
}

export interface ProxyReq {
  (proxyReq : ClientRequest, req : IncomingMessage, res : ServerResponse) : void
}

export interface ProxyRes {
  (proxyRes : ProxyResponse, req : IncomingMessage, res : ServerResponse  ) : void
}

