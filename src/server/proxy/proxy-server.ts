
import{ProxyListener} from './proxy-listener';

export interface ProxyServer {
  addErrorListener(listener: ProxyListener);
  addRequestListener(listener: ProxyListener);
  addResponseListener(listener: ProxyListener);
  addSelectAndReplaceListener(listener : ProxyListener);
  
  listen(port : number);}