import { Log } from '../logger';
import { ProxyEventEmitter } from './proxy-event-emitter';
import * as proxy from 'http-proxy-middleware';
import {ProxyOptions} from './proxy-options';

export class ProxyMWEventEmitter implements ProxyEventEmitter { 

  private proxyOptions : ProxyOptions;
  private proxy : any;
  private map : Map<string, Array<Function>>;
  private target : string;
  private log : Log;

/* istanbul ignore next */
  constructor(target : string, log : Log) {
    this.log = log;
    this.map = new Map<string,Array<Function>>();
    log.debug(`target = ${target}`);
    this.proxy = proxy('/',{
      target: target,
      changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
      logLevel: this.log.level,
      pathRewrite: (path, req) => { 
        (req as any).newPath = '';
        if ((req as any).context != null) {
          this.log.debug('context is defined');
        }
        else {
          this.log.debug('context is undefined');
        }
        this.notifyListeners('pathRewrite', req, {}, {}); 
        if (req.newPath) {
          return req.newPath;
        }
      },
      onError : (err,req,res) => { this.notifyListeners('error',err,req,res); },
      onProxyRes : (proxyRes,req,res) => { this.notifyListeners('proxyRes',proxyRes,req,res); },
      onProxyReq : (proxyReq,req,res) => { this.notifyListeners('proxyReq',proxyReq,req,res)},
    });    
  }

  /* istanbul ignore next */
  public on(eventName: string, callback: Function) {
    // tslint:disable-next-line:triple-equals
    if (this.map[eventName] == null) {
      this.map[eventName] = new Array<Function>();
    }
    this.map[eventName].push(callback);
  }

/* istanbul ignore next */
  public  getRequestListener() { return this.proxy; }

/* istanbul ignore next */
  private notifyListeners(eventName: string, err, req, res) {
    let listeners: Array<Function> = this.map[eventName];
    listeners.forEach( (listener) => {
      listener(err, req, res);
    });
  }

}