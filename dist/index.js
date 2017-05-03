"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_web_server_1 = require("./webserver/connect-web-server");
const http_proxy_server_1 = require("./proxy/http-proxy-server");
const proxy_listeners_1 = require("./proxy/proxy-listeners");
const winston_logger_1 = require("./winston-logger");
const harmon_streaming_html_middleware_1 = require("./utils/harmon-streaming-html-middleware");
const httpProxy = require("http-proxy");
var log = new winston_logger_1.WinstonLog();
var proxyListeners = new proxy_listeners_1.ProxyListeners(log);
function logContext(context) {
    log.debug('Logging context: ');
    log.debug(` context.error: ${context.error}`);
    log.debug(` context.dataMap: ${context.dataMap}`);
}
class testErrorProxyListner {
    handleEvent(logger, context) {
        log.debug("testErrorProxyListenr - hello: ");
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testErrorProxyListner");
proxyListeners.addErrorListener(new testErrorProxyListner());
class testParseProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testParsePRoxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testParseProxyListener");
proxyListeners.addParseListener(new testParseProxyListener());
class testRedirectProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRedirectProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testRedirectProxyListener");
proxyListeners.addRedirectListener(new testRedirectProxyListener());
class testRequestProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRequestProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
log.debug("Adding testRequestProxyListener");
proxyListeners.addRequestListener(new testRequestProxyListener());
class testResponseProxyListener {
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
var harmon = new harmon_streaming_html_middleware_1.HarmonStreamingHtmlMiddleware(log);
var proxyServer = new http_proxy_server_1.HttpProxyServer(proxyEventEmitter, webServer, harmon, log);
proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName', '<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');
/*
http.createServer((req, res) => {
        log.debug('WEB SERVER RECEIVED REQUEST');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head></head><body><div class="b">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
            res.end();
}).listen(9000);
*/
proxyServer.listen(8001);
//# sourceMappingURL=index.js.map