
import {Log} from '../logger';
import {ProxyContext} from './proxy-context';

export class ProxyListener {
  public handleEvent(logger : Log, context : any) : void {    
    logger.debug('Base handleEvent');
    throw new Error('Not implemented');
  }
}

export class ResponseSelectAndReplace {
  public cssSelectString : string;
  public replaceString : string;

  constructor(cssSelectString : string, replaceString : string) {
    this.cssSelectString = cssSelectString;
    this.replaceString = replaceString;
  }
}