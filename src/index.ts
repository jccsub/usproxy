import {ConnectWebServer} from './webserver/connect-web-server';
import {HttpProxyProxyServer} from './proxy/httpproxy-proxy-server';
import {ProxyListeners} from './proxy/proxy-listeners';
import {WinstonLog} from './winston-logger';
import {Log} from './logger';
import {ProxyContext} from './proxy/proxy-context'

import {
  ProxyListener, 
  ResponseSelectAndReplace
} from './proxy/proxy-listener';

import * as http from 'http';
import * as httpProxy from 'http-proxy';

var log = new WinstonLog();


var proxyListeners = new ProxyListeners(log);

function logContext(context: ProxyContext) {
  log.debug('Logging context: ');
  log.debug(` context.error: ${context.error}`);
  log.debug(` context.dataMap: ${context.dataMap}`);
}

class testErrorProxyListner extends ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testErrorProxyListner")
proxyListeners.addErrorListener(new testErrorProxyListner());

class testParseProxyListener extends ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testParseProxyListener")
proxyListeners.addParseListener(new testParseProxyListener());

class testRedirectProxyListener extends ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRedirectProxyListener")
proxyListeners.addRedirectListener(new testRedirectProxyListener());

class testRequestProxyListener extends ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRequestProxyListener")
proxyListeners.addRequestListener(new testRequestProxyListener());

class testResponseProxyListener extends ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testResponseProxyListener")
proxyListeners.addResponseListener(new testResponseProxyListener());

var webServer = new ConnectWebServer(log);
var proxyEventEmitter = new httpProxy.createProxyServer({target:'http://jccsub2web.newgen.corp'});
var proxyServer = new HttpProxyProxyServer(proxyEventEmitter, webServer,  log);

proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName','<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');

http.createServer((req, res) => {
        log.debug('WEB SERVER RECEIVED REQUEST');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head></head><body><div class="b">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
            res.end();
}).listen(9000);


proxyServer.listen(8001);


