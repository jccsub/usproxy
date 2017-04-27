import {ConnectWebServer} from './webserver/connect-web-server';
import {HttpProxyProxyServer} from './proxy/httpproxy-proxy-server';
import {ProxyListeners} from './proxy/proxy-listeners';
import {WinstonLog} from './winston-logger';
import {Log} from './logger';
import {ProxyContext} from './proxy/proxy-context'

import {
  ProxyListener, 
  ErrorProxyListener, 
  ParseProxyListener, 
  RedirectProxyListener, 
  RequestProxyListener, 
  ResponseProxyListener,
  ResponseSelectAndReplace
} from './proxy/proxy-listener';

import * as http from 'http';

var log = new WinstonLog();


var proxyListeners = new ProxyListeners(log);

function logContext(context: ProxyContext) {
  log.debug('Logging context: ');
  log.debug(` context.error: ${context.error}`);
  log.debug(` context.dataMap: ${context.dataMap}`);
}

class testErrorProxyListner extends ErrorProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testErrorProxyListner")
proxyListeners.addListener(new testErrorProxyListner());

class testParseProxyListener extends ParseProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testParseProxyListener")
proxyListeners.addListener(new testParseProxyListener());

class testRedirectProxyListener extends RedirectProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRedirectProxyListener")
proxyListeners.addListener(new testRedirectProxyListener());

class testRequestProxyListener extends RequestProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRequestProxyListener")
proxyListeners.addListener(new testRequestProxyListener());

class testResponseProxyListener extends ResponseProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testResponseProxyListener")
proxyListeners.addListener(new testResponseProxyListener());

proxyListeners.addResponseSelectAndReplace('.b','<div class="c">+ Trumpet</div>');
proxyListeners.addResponseSelectAndReplace('.a','<div>JUST TESTING</div>');
proxyListeners.addResponseSelectAndReplace('.c','<div>Did this replace</div>');

var webServer = new ConnectWebServer(log);
var proxyServer = new HttpProxyProxyServer(webServer,'http://localhost:9000', proxyListeners, log);



http.createServer((req, res) => {
        log.debug('WEB SERVER RECEIVED REQUEST');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head></head><body><div class="b">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
            res.end();
}).listen(9000);


proxyServer.listen(8001);


