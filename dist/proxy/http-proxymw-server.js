"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_context_1 = require("./proxy-context");
const proxy = require("http-proxy-middleware");
const connect = require("connect");
const http = require("http");
class HttpProxyMiddlewareServer {
    constructor(log) {
        this.log = log;
        this.app = connect();
    }
    executeProxyReqHandlers(proxyReq, req, res) {
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
    }
    executeProxyResHandlers(proxyRes, req, res) {
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
    }
    executeErrorHandlers(err, req, res) {
        this.listeners.errorProxyListeners.forEach((listener) => {
            if (req != null) {
                req.context.error = err;
                listener.handleEvent(this.log, req.context);
            }
            else
                listener.handleEvent(this.log, err);
        });
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
    listen(port, target) {
        this.proxy = proxy({
            target: target,
            changeOrigin: true,
            logLevel: 'debug',
            onError: (err, req, res) => { this.executeErrorHandlers(err, req, res); },
            onProxyRes: (proxyRes, req, res) => { this.executeProxyResHandlers(proxyRes, req, res); },
            onProxyReq: (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res); },
        });
        http.createServer(this.app).listen(port);
    }
}
exports.HttpProxyMiddlewareServer = HttpProxyMiddlewareServer;
//# sourceMappingURL=http-proxymw-server.js.map