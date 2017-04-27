"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_context_1 = require("./proxy-context");
//import * as http from 'http';
var http = require('http'), httpProxy = require('http-proxy');
var connect = require('connect');
class HttpProxyProxyServer {
    constructor(webserver, target, listeners, log) {
        this.selectAndReplace = [];
        this.webServer = webserver;
        this.listeners = listeners;
        this.target = target;
        this.log = log;
        this.log.debug(`Setting up proxy for ${target}`);
        this.proxy = httpProxy.createProxyServer({ target: this.target });
    }
    listen(port) {
        this.setupResponseSearchAndReplace();
        this.setupErrorListeners();
        this.setupRequestListers();
        this.setupResponseListeners();
        this.setupMiddleware();
        this.log.debug(`HttpProxyProxyServer listening on port ${port}`);
        this.webServer.use(require('harmon')([], this.selectAndReplace));
        this.webServer.use((req, res) => {
            this.proxy.web(req, res);
        });
        this.webServer.listen(port);
    }
    setupErrorListeners() {
        this.listeners.errorProxyListeners.forEach((listener) => {
            this.proxy.on('error', (error, req, res, next) => {
                this.log.error(`Error proxy listener: ${error.message}`);
                if (req != null)
                    listener.handleEvent(this.log, req.context);
            });
        });
    }
    setupRequestListers() {
        this.proxy.on('proxyReq', (proxyReq, req, res) => {
            this.log.debug('proxy.on("proxyReq")');
            let context = new proxy_context_1.ProxyContext();
            context.request.body = '';
            req.context = context;
            let dataAvailable = false;
            proxyReq.on('data', (chunk) => {
                this.log.debug('proxyReq.on("data"');
                dataAvailable = true;
                context.request.body += chunk;
            });
            proxyReq.on('end', () => {
                this.log.debug('proxyReq.on("end"');
                this.listeners.requestProxyListeners.forEach((listener) => {
                    listener.handleEvent(this.log, context);
                });
            });
        });
    }
    setupResponseListeners() {
        this.proxy.on('proxyRes', (proxyRes, req, res) => {
            this.log.debug('proxy.on("proxyRes")');
            let context = req.context;
            let dataAvailable = false;
            proxyRes.on('data', (chunk) => {
                this.log.debug('proxyRes.on("data")');
                context.response.body += chunk;
            });
            proxyRes.on('end', () => {
                this.log.debug('proxyRes.on("end")');
                this.listeners.responseProxyListeners.forEach((listener) => {
                    listener.handleEvent(this.log, context);
                });
                context.response.headers = proxyRes.headers;
                context.response.statusCode = proxyRes.statusCode;
            });
        });
    }
    setupResponseSearchAndReplace() {
        this.listeners.responseSelectAndReplace.forEach(selectAndReplaceItem => {
            let item = {};
            item.query = selectAndReplaceItem.cssSelectString;
            item.func = function (node) { node.createWriteStream().end(selectAndReplaceItem.replaceString); };
            this.selectAndReplace.push(item);
        });
    }
    setupMiddleware() {
        this.webServer.use(require('harmon')([], this.selectAndReplace));
        this.webServer.use((req, res) => { this.proxy.web(req, res); });
    }
}
exports.HttpProxyProxyServer = HttpProxyProxyServer;
//# sourceMappingURL=httpproxy-proxy-server.js.map