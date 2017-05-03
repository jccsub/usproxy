import {ConnectWebServer} from './webserver/connect-web-server';
import {HttpProxyServer} from './proxy/http-proxy-server';
import {ProxyListenerCollection} from './proxy/proxy-listener-collection';
import {WinstonLog} from './winston-logger';
import {Log} from './logger';
import {ProxyContext} from './proxy/proxy-context'
import {ProxyListener} from './proxy/proxy-listener';
import {StreamingHtmlMiddleware} from './utils/streaming-html-middleware';
import {HarmonStreamingHtmlMiddleware} from './utils/harmon-streaming-html-middleware';
import * as http from 'http';
import * as httpProxy from 'http-proxy';

var log = new WinstonLog();


var proxyListeners = new ProxyListenerCollection(log);

function logContext(context: ProxyContext) {
  log.debug('Logging context: ');
  log.debug(` context.error: ${context.error}`);
  log.debug(` context.dataMap: ${context.dataMap}`);
}

class testErrorProxyListner implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testErrorProxyListner")
proxyListeners.addErrorListener(new testErrorProxyListner());

class testParseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

log.debug("Adding testParseProxyListener")
proxyListeners.addParseListener(new testParseProxyListener());

class testRedirectProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRedirectProxyListener")
proxyListeners.addRedirectListener(new testRedirectProxyListener());

class testRequestProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}
log.debug("Adding testRequestProxyListener")
proxyListeners.addRequestListener(new testRequestProxyListener());

class testResponseProxyListener implements ProxyListener {
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
var harmon = new HarmonStreamingHtmlMiddleware(log);
var proxyServer = new HttpProxyServer(proxyEventEmitter,  webServer, harmon,  log);

proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName','<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');

proxyServer.listen(8001);


