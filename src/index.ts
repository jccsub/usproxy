import { HttpWebserver } from './server/http-web-server';
import { ProxyListener } from './proxy/proxy-listener';
import { ProxyContext } from './proxy/proxy-context';
import { ProxyMWEventEmitter } from './proxy/http-proxy-mw-event-emitter';
import {Log} from './logger';
import {WinstonLog} from './winston-logger';


import {ConnectApplication} from './server/connect-application';
import {HttpProxyMiddlewareServer} from './proxy/http-proxymw-server';


import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as httpProxyMiddleware from 'http-proxy-middleware';

var log = new WinstonLog();



function logContext(context: ProxyContext) {
  log.debug('Logging context: ');
  log.debug(` context.error: ${context.error}`);
  log.debug(` context.dataMap: ${context.dataMap}`);
}

class testErrorProxyListner implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class testParseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class testRedirectProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class testRequestProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class testResponseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}


let webServer = new HttpWebserver();
let app = new ConnectApplication();

var proxyEventEmitter = new ProxyMWEventEmitter('http://httpbin.org/', log);
var proxyServer = new HttpProxyMiddlewareServer(proxyEventEmitter, webServer, app, log);
proxyServer.addRequestListener(new testRequestProxyListener());
proxyServer.addResponseListener(new testResponseProxyListener());
proxyServer.addResponseSelectAndReplace('#ENDPOINTS','<h2>MYTITLE</h2>');
proxyServer.addRedirectListener(new testRedirectProxyListener());
proxyServer.addParseListener(new testParseProxyListener());
proxyServer.addErrorListener(new testErrorProxyListner());

proxyServer.listen(8001);


