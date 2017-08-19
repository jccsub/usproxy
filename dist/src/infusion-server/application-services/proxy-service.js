"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_proxy_request_handler_1 = require("../domain-services/event-handlers/infusion-proxy-request-handler");
const infusion_proxy_response_handler_1 = require("../domain-services/event-handlers/infusion-proxy-response-handler");
const infusion_error_handler_1 = require("../domain-services/event-handlers/infusion-error-handler");
const infusion_path_rewrite_handler_1 = require("../domain-services/event-handlers/infusion-path-rewrite-handler");
const http = require("http");
const proxy = require("http-proxy-middleware");
const connect = require("connect");
class ProxyService {
    constructor(log, markupModifier, configuration) {
        this.log = log;
        this.configuration = configuration;
        this.connectApp = connect();
        this.markupModifier = markupModifier;
    }
    listen(target, port) {
        this.proxy = this.createProxyServer(target);
        this.connectApp.use(this.proxy);
        this.log.info(`ProxyService.listen(target: ${target}, port: ${port})`);
        http.createServer(this.connectApp).listen(port);
    }
    createProxyServer(target) {
        return proxy('/', {
            target: target,
            changeOrigin: true,
            logLevel: this.log.level,
            pathRewrite: (path, req) => {
                this.log.debug(`ProxyService.setupProxyService.pathRewrite, path=${path}`);
                req.newPath = '';
                new infusion_path_rewrite_handler_1.InfusionPathRewriteHandler(this.log).handle(path, req);
                if (req.newPath) {
                    this.log.debug(`ProxyService.setupProxyService.pathRewrite - newPath=${req.newPath}`);
                    return req.newPath;
                }
            },
            onError: (err, req, res) => { new infusion_error_handler_1.InfusionErrorHandler(this.log).handle(err, req, res); },
            onProxyRes: (proxyRes, req, res) => {
                this.markupModifier.performModifications(req, res);
                new infusion_proxy_response_handler_1.InfusionProxyResponseHandler(this.log).handle(proxyRes, req, res);
            },
            onProxyReq: (proxyReq, req, res) => { new infusion_proxy_request_handler_1.InfusionProxyRequestHandler(this.log).handle(proxyReq, req, res); }
        });
    }
}
exports.ProxyService = ProxyService;
//# sourceMappingURL=proxy-service.js.map