"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_proxy_context_1 = require("./json-proxy-context");
const proxy_listener_collection_1 = require("./proxy-listener-collection");
class HttpProxyMiddlewareServer {
    constructor(proxyEventEmitter, webServer, app, selectAndReplaceFactory, log) {
        this.log = log;
        this.listeners = new proxy_listener_collection_1.ProxyListenerCollection(log);
        this.app = app;
        this.webServer = webServer;
        this.proxyEventEmitter = proxyEventEmitter;
        this.selectAndReplaceFactory = selectAndReplaceFactory;
    }
    initializeContextIfNotInitialized(req) {
        let context = req.context;
        // tslint:disable-next-line:triple-equals
        if (context == null) {
            req.context = new json_proxy_context_1.JsonProxyContext(this.log);
        }
        return req.context;
    }
    executeProxyReqHandlers(proxyReq, req, res) {
        let context = this.initializeContextIfNotInitialized(req);
        context.request.body = '';
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
        let dataAvailable = false;
        let context = req.context;
        this.listeners.selectAndReplaceListeners.forEach((listener) => {
            listener.handleEvent(this.log, context);
        });
        let selectAndReplacer = this.selectAndReplaceFactory.create(this.log);
        this.log.debug(`executeProxyResHandlers - selectAndReplaceItems count = ${context.selectAndReplaceItems.length}`);
        selectAndReplacer.addSelectAndReplaceItems(context.selectAndReplaceItems);
        selectAndReplacer.execute(req, res);
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
    executeSelectAndReplaceHandlers(req, res) {
        let context = req.context;
        // tslint:disable-next-line:triple-equals
        if (context != null) {
            this.listeners.selectAndReplaceListeners.forEach((listener) => {
                listener.handleEvent(this.log, context);
            });
        }
    }
    executePathRewriteHandlers(req) {
        let context = this.initializeContextIfNotInitialized(req);
        // tslint:disable-next-line:triple-equals
        this.listeners.pathRewriteListeners.forEach((listener) => {
            listener.handleEvent(this.log, context);
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
    addSelectAndReplaceListener(listener) {
        this.listeners.addSelectAndReplaceListener(listener);
    }
    listen(port) {
        let x = 0;
        this.proxyEventEmitter.on('error', (err, req, res) => { this.executeErrorHandlers(err, req, res); });
        this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => { this.executeProxyResHandlers(proxyRes, req, res); });
        this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res); });
        this.proxyEventEmitter.on('pathRewrite', (req) => { this.executePathRewriteHandlers(req); req.newPath = req.context.rewritePath; });
        this.app.use(this.proxyEventEmitter.getRequestListener());
        //    this.app.use(harmon.selectAndReplaceCallback);
        this.webServer.startServer(port, this.app.requestListener);
    }
}
exports.HttpProxyMiddlewareServer = HttpProxyMiddlewareServer;
//# sourceMappingURL=http-proxymw-server.js.map