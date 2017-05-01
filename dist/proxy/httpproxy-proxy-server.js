"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_listeners_1 = require("./proxy-listeners");
const proxy_context_1 = require("./proxy-context");
const harmon = require("harmon");
var connect = require('connect');
class HttpProxyProxyServer {
    constructor(proxyEventEmitter, webserver, log) {
        this.selectAndReplace = [];
        this.webServer = webserver;
        this.listeners = new proxy_listeners_1.ProxyListeners(log);
        this.log = log;
        this.proxy = proxyEventEmitter;
    }
    listen(port) {
        this.setupResponseSearchAndReplace();
        this.setupErrorListeners();
        this.setupRequestListeners();
        this.setupResponseListeners();
        this.setupMiddleware();
        this.log.debug(`HttpProxyProxyServer listening on port ${port}`);
        this.webServer.use(require('harmon')([], this.selectAndReplace));
        this.webServer.use((req, res) => {
            this.proxy.web(req, res);
        });
        this.webServer.listen(port);
    }
    addErrorListener(proxyListener) {
        this.listeners.addErrorListener(proxyListener);
    }
    addParseListener(listener) {
        this.listeners.addErrorListener(listener);
    }
    addRedirectListener(listener) {
        this.listeners.addErrorListener(listener);
    }
    addRequestListener(listener) {
        this.listeners.addErrorListener(listener);
    }
    addResponseListener(listener) {
        this.listeners.addErrorListener(listener);
    }
    addResponseSelectAndReplace(cssSelect, replaceString) {
        this.listeners.addResponseSelectAndReplace(cssSelect, replaceString);
    }
    setupErrorListeners() {
        this.log.debug('setupErrorListeners');
        this.listeners.errorProxyListeners.forEach((listener) => {
            this.proxy.on('error', (error, req, res, next) => {
                this.log.error(`Error proxy listener: ${error.message}`);
                if (req != null) {
                    req.context.error = error;
                    listener.handleEvent(this.log, req.context);
                }
                else
                    listener.handleEvent(this.log, error);
            });
        });
    }
    setupRequestListeners() {
        this.log.debug('setupRequestListeners');
        this.proxy.on('proxyReq', (proxyReq, req, res) => {
            this.log.debug('proxy.on(proxyReq)');
            let context = new proxy_context_1.ProxyContext();
            context.request.body = '';
            req.context = context;
            let dataAvailable = false;
            req.on('data', (chunk) => {
                dataAvailable = true;
                context.request.body += chunk;
            });
            req.on('end', () => {
                context.request.url = req.url;
                context.request.host = req.headers.host;
                context.request.protocol = 'http';
                context.request.method = req.method;
                this.listeners.requestProxyListeners.forEach((listener) => {
                    listener.handleEvent(this.log, context);
                });
            });
        });
    }
    setupResponseListeners() {
        this.log.debug('setupResponseListeners');
        this.proxy.on('proxyRes', (proxyRes, req, res) => {
            this.log.debug('proxy.on("proxyRes")');
            let context = req.context;
            let dataAvailable = false;
            proxyRes.on('data', (chunk) => {
                context.response.body += chunk.toString('utf8');
            });
            proxyRes.on('end', () => {
                this.log.debug('proxyRes.on("end")');
                context.response.headers = proxyRes.headers;
                context.response.statusCode = proxyRes.statusCode;
                this.listeners.responseProxyListeners.forEach((listener) => {
                    listener.handleEvent(this.log, context);
                });
            });
        });
    }
    listProperties(obj) {
        this.log.debug(`TypeOf ${typeof obj}`);
        let array = Object.getOwnPropertyNames(obj);
        array.forEach((item) => {
            this.log.debug(`${item}`);
        });
    }
    setupResponseSearchAndReplace() {
        this.log.debug('setupResponseSearchAndReplace');
        this.listeners.responseSelectAndReplace.forEach(selectAndReplaceItem => {
            let item = {};
            item.query = selectAndReplaceItem.cssSelectString;
            item.func = (node) => {
                this.listProperties(node);
                node.createWriteStream().end(selectAndReplaceItem.replaceString);
            };
            this.selectAndReplace.push(item);
        });
    }
    setupMiddleware() {
        this.webServer.use(harmon([], this.selectAndReplace));
        this.webServer.use((req, res) => { this.proxy.web(req, res); });
    }
}
exports.HttpProxyProxyServer = HttpProxyProxyServer;
//# sourceMappingURL=httpproxy-proxy-server.js.map