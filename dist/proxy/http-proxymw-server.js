"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var selects = [];
        var simpleselect = {};
        simpleselect.query = '#ENDPOINTS';
        simpleselect.func = function (node) {
            node.createWriteStream().end('<div>+ Trumpet</div>');
        };
        selects.push(simpleselect);
        var x = require('harmon')([], selects);
        x(req, res, () => { this.log.info('next would have been called'); });
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
    addResponseSelectAndReplace(cssSelect, replaceString) {
        this.listeners.addResponseSelectAndReplace(cssSelect, replaceString);
    }
    listen(port) {
        let x = 0;
        this.proxyEventEmitter.on('error', (err, req, res) => { this.executeErrorHandlers(err, req, res); });
        this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => { this.executeProxyResHandlers(proxyRes, req, res); });
        this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res); });
        this.app.use(this.proxyEventEmitter.getRequestListener());
        //    this.app.use(harmon.selectAndReplaceCallback);
        this.webServer.startServer(port, this.app.requestListener);
    }
}
exports.HttpProxyMiddlewareServer = HttpProxyMiddlewareServer;
//# sourceMappingURL=http-proxymw-server.js.map