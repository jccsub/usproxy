"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_web_server_1 = require("./server/http-web-server");
const http_proxy_mw_event_emitter_1 = require("./proxy/http-proxy-mw-event-emitter");
const winston_logger_1 = require("./winston-logger");
const connect_application_1 = require("./server/connect-application");
const http_proxymw_server_1 = require("./proxy/http-proxymw-server");
var log = new winston_logger_1.WinstonLog();
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
class testParseProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testParsePRoxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
class testRedirectProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRedirectProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
class testRequestProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testRequestProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
class testResponseProxyListener {
    handleEvent(logger, context) {
        log.debug('Hello from testResponseProxyListener');
        log.debug(`${context.toString()}`);
        return false;
    }
}
let webServer = new http_web_server_1.HttpWebserver();
let app = new connect_application_1.ConnectApplication();
var proxyEventEmitter = new http_proxy_mw_event_emitter_1.ProxyMWEventEmitter('http://jccsub2web.newgen.corp', log);
var proxyServer = new http_proxymw_server_1.HttpProxyMiddlewareServer(proxyEventEmitter, webServer, app, log);
proxyServer.addRequestListener(new testRequestProxyListener());
proxyServer.addResponseListener(new testResponseProxyListener());
proxyServer.addResponseSelectAndReplace('#ctl00_Content_Login1_lblUserName', '<label id="ctl00_Content_Login1_lblUserName" for="ctl00_Content_Login1_UserName" localizableLabel="Username">MyUserName</label>');
proxyServer.addRedirectListener(new testRedirectProxyListener());
proxyServer.addParseListener(new testParseProxyListener());
proxyServer.addErrorListener(new testErrorProxyListner());
proxyServer.listen(8001);
//# sourceMappingURL=index.js.map