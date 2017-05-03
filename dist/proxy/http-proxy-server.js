"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_listeners_1 = require("./proxy-listeners");
const proxy_context_1 = require("./proxy-context");
var connect = require('connect');
class HttpProxyServer {
    constructor(proxyEventEmitter, webserver, streamingHtmlMiddleware, log) {
        this.selectAndReplace = [];
        this.webServer = webserver;
        this.log = log;
        this.listeners = new proxy_listeners_1.ProxyListeners(log);
        this.proxy = proxyEventEmitter;
        this.streamingHtmlMiddleware = streamingHtmlMiddleware;
    }
    listen(port) {
        this.setupErrorListeners();
        this.setupRequestListeners();
        this.setupResponseListeners();
        this.setupMiddleware();
        this.webServer.use(require('harmon')([], this.selectAndReplace));
        this.webServer.listen(port);
    }
    addErrorListener(proxyListener) {
        this.listeners.addErrorListener(proxyListener);
    }
    addParseListener(listener) {
        this.listeners.addParseListener(listener);
    }
    addRedirectListener(listener) {
        this.listeners.addRedirectListener(listener);
    }
    addRequestListener(listener) {
        this.listeners.addRequestListener(listener);
    }
    addResponseListener(listener) {
        this.listeners.addResponseListener(listener);
    }
    addResponseSelectAndReplace(cssSelect, replaceString) {
        this.listeners.addResponseSelectAndReplace(cssSelect, replaceString);
    }
    setupErrorListeners() {
        this.listeners.errorProxyListeners.forEach((listener) => {
            this.proxy.on('error', (error, req, res, next) => {
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
        this.proxy.on('proxyReq', (proxyReq, req, res) => {
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
        this.proxy.on('proxyRes', (proxyRes, req, res) => {
            let context = req.context;
            let dataAvailable = false;
            proxyRes.on('data', (chunk) => {
                context.response.body += chunk.toString('utf8');
            });
            proxyRes.on('end', () => {
                context.response.headers = proxyRes.headers;
                context.response.statusCode = proxyRes.statusCode;
                this.listeners.responseProxyListeners.forEach((listener) => {
                    listener.handleEvent(this.log, context);
                });
            });
        });
    }
    setupMiddleware() {
        this.streamingHtmlMiddleware.selectAndReplaceItems = this.streamingHtmlMiddleware.selectAndReplaceItems.concat(this.listeners.responseSelectAndReplace);
        this.webServer.use(this.streamingHtmlMiddleware.selectAndReplaceCallback);
        this.webServer.use((req, res) => { this.proxy.web(req, res); });
    }
}
exports.HttpProxyServer = HttpProxyServer;
//# sourceMappingURL=http-proxy-server.js.map