"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_parser_1 = require("../src/mapper/request-parser");
const http_web_server_1 = require("../src/server/http-web-server");
const connect_application_1 = require("../src/server/connect-application");
const http_proxymw_server_1 = require("../src/proxy/http-proxymw-server");
const http_proxy_mw_event_emitter_1 = require("../src/proxy/http-proxy-mw-event-emitter");
const harmon_response_select_and_replace_1 = require("../src/proxy/harmon-response-select-and-replace");
const winston_logger_1 = require("../src/winston-logger");
const data_mapper_1 = require("../src/mapper/data-mapper");
class ContextLogger {
    constructor(log) {
        this.log = log;
    }
    handleEvent(context) {
        // tslint:disable-next-line:triple-equals
        if (context != null) {
            this.log.debug(context.toString());
        }
    }
}
class TestSetup {
    constructor(target, port) {
        this.errorListeners = new Array();
        this.parseListeners = new Array();
        this.redirectListeners = new Array();
        this.requestListeners = new Array();
        this.responseListeners = new Array();
        this.responseSelectAndReplaceListeners = new Array();
        this.target = target;
        this.port = port;
        this.log = new winston_logger_1.WinstonLog();
    }
    startTest() {
        let proxyEventEmitter = new http_proxy_mw_event_emitter_1.ProxyMWEventEmitter(this.target, this.log);
        let selectAndReplaceFactory = new harmon_response_select_and_replace_1.HarmonResponseSelectAndReplaceFactory();
        let proxyServer = new http_proxymw_server_1.HttpProxyMiddlewareServer(proxyEventEmitter, new http_web_server_1.HttpWebserver(), new connect_application_1.ConnectApplication(), selectAndReplaceFactory, this.log);
        this.requestListeners.push(new data_mapper_1.DataMapper(new request_parser_1.RequestParser(this.log), this.log));
        this.responseListeners.push(new ContextLogger(this.log));
        this.errorListeners.forEach((listener) => { proxyServer.addErrorListener(listener); });
        this.parseListeners.forEach((listener) => { proxyServer.addParseListener(listener); });
        this.redirectListeners.forEach((listener) => { proxyServer.addRedirectListener(listener); });
        this.requestListeners.forEach((listener) => { proxyServer.addRequestListener(listener); });
        this.responseListeners.forEach((listener) => { proxyServer.addResponseListener(listener); });
        this.responseSelectAndReplaceListeners.forEach((listener) => { proxyServer.addSelectAndReplaceListener(listener); });
        proxyServer.listen(this.port);
    }
}
exports.TestSetup = TestSetup;
//# sourceMappingURL=test-setup.js.map