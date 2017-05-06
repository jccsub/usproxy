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
import * as httpProxyMiddleware from 'http-proxy-middleware';

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

class testParseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

class testRedirectProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

class testRequestProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}

class testResponseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
    log.debug(`${context.toString()}`);
    return false;
  }
}


var webServer = new ConnectWebServer(log);

var proxyEventEmitter = httpProxy.createProxyServer({target:'http://jccsub2web.newgen.corp'});
var harmon = new HarmonStreamingHtmlMiddleware(log);
var proxyServer = new HttpProxyServer(proxyEventEmitter,  webServer, harmon,  log);

proxyServer.addRequestListener(new testRequestProxyListener());
proxyServer.addResponseListener(new testResponseProxyListener());
proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName','<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');
proxyServer.addRedirectListener(new testRedirectProxyListener());
proxyServer.addParseListener(new testParseProxyListener());
proxyServer.addErrorListener(new testErrorProxyListner());

proxyServer.listen(8001,'');


