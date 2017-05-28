import {ProxyContext} from './proxy-context';

export interface ProxyListener {
  handleEvent( context : ProxyContext | Error) : void;
}
