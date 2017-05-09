
import{ProxyListener} from './proxy-listener';

export interface ProxyServer {
  addErrorListener(listener: ProxyListener);
  addParseListener(listener: ProxyListener);
  addRedirectListener(listener : ProxyListener);
  addRequestListener(listener: ProxyListener);
  addResponseListener(listener: ProxyListener);
  addResponseSelectAndReplace(cssSelect : string, replaceString : string) ;
  listen(port : number);}