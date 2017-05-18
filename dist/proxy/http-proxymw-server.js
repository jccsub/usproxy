"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harmon_streaming_html_middleware_1 = require("../utils/harmon-streaming-html-middleware");
const proxy_context_1 = require("./proxy-context");
const proxy_listener_collection_1 = require("./proxy-listener-collection");
class HttpProxyMiddlewareServer {
    constructor(proxyEventEmitter, webServer, app, log) {
        this.log = log;
        this.listeners = new proxy_listener_collection_1.ProxyListenerCollection(log);
        this.app = app;
        this.webServer = webServer;
        this.proxyEventEmitter = proxyEventEmitter;
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
            // tslint:disable-next-line:triple-equals
            if (req != null) {
                req.context.error = err;
                listener.handleEvent(this.log, req.context);
            }
            else {
                listener.handleEvent(this.log, err);
            }
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
    listen(port) {
        this.proxyEventEmitter.on('error', (err, req, res) => { this.executeErrorHandlers(err, req, res); });
        this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => { this.executeProxyResHandlers(proxyRes, req, res); });
        this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res); });
        var harmon = new harmon_streaming_html_middleware_1.HarmonStreamingHtmlMiddleware(this.log);
        harmon.selectAndReplaceItems = harmon.selectAndReplaceItems.concat(this.listeners.responseSelectAndReplace);
        this.app.use(harmon.selectAndReplaceCallback);
        this.app.use(this.proxyEventEmitter.getRequestListener());
        this.webServer.startServer(port, this.app.requestListener);
    }
}
exports.HttpProxyMiddlewareServer = HttpProxyMiddlewareServer;
//# sourceMappingURL=http-proxymw-server.js.map