"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_web_server_1 = require("./webserver/connect-web-server");
const httpproxy_proxy_server_1 = require("./proxy/httpproxy-proxy-server");
const proxy_listeners_1 = require("./proxy/proxy-listeners");
const winston_logger_1 = require("./winston-logger");
const proxy_listener_1 = require("./proxy/proxy-listener");
const http = require("http");
const httpProxy = require("http-proxy");
var log = new winston_logger_1.WinstonLog();
var proxyListeners = new proxy_listeners_1.ProxyListeners(log);
function logContext(context) {
    log.debug('Logging context: ');
    log.debug(` context.error: ${context.error}`);
    log.debug(` context.dataMap: ${context.dataMap}`);
}
class testErrorProxyListner extends proxy_listener_1.ProxyListener {
    handleEvent(logger, context) {
        log.debug("testErrorProxyListenr - hello: ");
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testErrorProxyListner");
proxyListeners.addErrorListener(new testErrorProxyListner());
class testParseProxyListener extends proxy_listener_1.ProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testParsePRoxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testParseProxyListener");
proxyListeners.addParseListener(new testParseProxyListener());
class testRedirectProxyListener extends proxy_listener_1.ProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRedirectProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testRedirectProxyListener");
proxyListeners.addRedirectListener(new testRedirectProxyListener());
class testRequestProxyListener extends proxy_listener_1.ProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRequestProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testRequestProxyListener");
proxyListeners.addRequestListener(new testRequestProxyListener());
class testResponseProxyListener extends proxy_listener_1.ProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testResponseProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testResponseProxyListener");
proxyListeners.addResponseListener(new testResponseProxyListener());
var webServer = new connect_web_server_1.ConnectWebServer(log);
var proxyEventEmitter = new httpProxy.createProxyServer({ target: 'http://jccsub2web.newgen.corp' });
var proxyServer = new httpproxy_proxy_server_1.HttpProxyProxyServer(proxyEventEmitter, webServer, log);
proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName', '<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');
http.createServer((req, res) => {
    log.debug('WEB SERVER RECEIVED REQUEST');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head></head><body><div class="b">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
    res.end();
}).listen(9000);
proxyServer.listen(8001);
//# sourceMappingURL=index.js.map