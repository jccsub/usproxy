
import {Log} from '../logger';
import {ProxyContext} from './proxy-context';

export interface ProxyListener {
  handleEvent(logger : Log, context : any) : void;
}
