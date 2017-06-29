"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_context_1 = require("./proxy-context");
const proxy_listener_collection_1 = require("./proxy-listener-collection");
const guards_1 = require("../utils/guards");
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
        // tslint:disable-next-line:triple-equals
        if (req.context == null) {
            req.context = new proxy_context_1.ProxyContext(this.log);
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
                listener.handleEvent(context);
            });
        });
    }
    executeProxyResHandlers(proxyRes, req, res) {
        let dataAvailable = false;
        let context = req.context;
        // tslint:disable-next-line:triple-equals
        if (context == null) {
            throw new Error('HttpProxyMiddlewareServer.executeProxyResHandlers - req.context cannot be null');
        }
        this.executeSelectAndReplaceHandlers(req, res);
        let selectAndReplacer = this.selectAndReplaceFactory.create(this.log);
        selectAndReplacer.addSelectAndReplaceItems(context.htmlModifications);
        selectAndReplacer.execute(req, res);
        proxyRes.on('data', (chunk) => {
            context.response.body += chunk.toString('utf8');
        });
        proxyRes.on('end', () => {
            context.response.headers = proxyRes.headers;
            context.response.statusCode = proxyRes.statusCode;
            this.listeners.responseProxyListeners.forEach((listener) => {
                listener.handleEvent(context);
            });
        });
    }
    executeErrorHandlers(err, req, res) {
        this.listeners.errorProxyListeners.forEach((listener) => {
            // tslint:disable-next-line:triple-equals
            if (req != null) {
                req.context.error = err;
                listener.handleEvent(req.context);
            }
            else {
                listener.handleEvent(err);
            }
        });
    }
    executeSelectAndReplaceHandlers(req, res) {
        let context = req.context;
        this.listeners.selectAndReplaceListeners.forEach((listener) => {
            listener.handleEvent(context);
        });
    }
    executePathRewriteHandlers(req) {
        let context = this.initializeContextIfNotInitialized(req);
        // tslint:disable-next-line:triple-equals
        this.listeners.pathRewriteListeners.forEach((listener) => {
            listener.handleEvent(context);
        });
    }
    addErrorListener(proxyListener) {
        this.listeners.addErrorListener(proxyListener);
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
    addPathRewriteListener(listener) {
        this.listeners.addPathRewriteListener(listener);
    }
    listen(port) {
        let x = 0;
        this.proxyEventEmitter.on('error', (err, req, res) => { this.executeErrorHandlers(err, req, res); });
        this.proxyEventEmitter.on('proxyRes', (proxyRes, req, res) => { this.executeProxyResHandlers(proxyRes, req, res); });
        this.proxyEventEmitter.on('proxyReq', (proxyReq, req, res) => { this.executeProxyReqHandlers(proxyReq, req, res); });
        this.proxyEventEmitter.on('pathRewrite', (req) => { this.executePathRewriteHandlers(req); req.newPath = req.context.rewritePath; });
        this.app.use(this.proxyEventEmitter.getRequestListener());
        this.webServer.startServer(port, this.app.requestListener);
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.notNull),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HttpProxyMiddlewareServer.prototype, "listen", null);
exports.HttpProxyMiddlewareServer = HttpProxyMiddlewareServer;
//# sourceMappingURL=http-proxymw-server.js.map