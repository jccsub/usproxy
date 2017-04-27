
import {Log} from '../logger';
import {ProxyContext} from './proxy-context';

export abstract class ProxyListener {
  abstract handleEvent(logger : Log, context : ProxyContext) : void;
}

export abstract class ErrorProxyListener extends ProxyListener {
  abstract handleEvent(logger: Log, context: ProxyContext): void;
};

export abstract class ParseProxyListener extends ProxyListener  {
  abstract handleEvent(logger: Log, context: ProxyContext): void;
};

export abstract class RedirectProxyListener extends ProxyListener {
  abstract handleEvent(logger: Log, context: ProxyContext): void;
};

export abstract class RequestProxyListener extends ProxyListener {
  abstract handleEvent(logger: Log, context: ProxyContext): void;
};

export abstract class ResponseProxyListener extends ProxyListener {
  abstract handleEvent(logger: Log, context: ProxyContext): void;
};

export class ResponseSelectAndReplace {
  public cssSelectString : string;
  public replaceString : string;

  constructor(cssSelectString : string, replaceString : string) {
    this.cssSelectString = cssSelectString;
    this.replaceString = replaceString;
  }
}