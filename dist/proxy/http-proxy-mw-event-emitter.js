"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy = require("http-proxy-middleware");
class ProxyMWEventEmitter {
    /* istanbul ignore next */
    constructor(target, log) {
        this.log = log;
        this.map = new Map();
        log.debug(`target = ${target}`);
        this.proxy = proxy('/', {
            target: target,
            changeOrigin: true,
            logLevel: this.log.level,
            onError: (err, req, res) => { this.notifyListeners('error', err, req, res); },
            onProxyRes: (proxyRes, req, res) => { this.notifyListeners('proxyRes', proxyRes, req, res); },
            onProxyReq: (proxyReq, req, res) => { this.notifyListeners('proxyReq', proxyReq, req, res); },
        });
    }
    /* istanbul ignore next */
    on(eventName, callback) {
        if (this.map[eventName] === null) {
            this.map[eventName] = new Array();
        }
        this.map[eventName].push(callback);
    }
    /* istanbul ignore next */
    getRequestListener() { return this.proxy; }
    /* istanbul ignore next */
    notifyListeners(eventName, err, req, res) {
        let listeners = this.map[eventName];
        listeners.forEach((listener) => {
            listener(err, req, res);
        });
    }
}
exports.ProxyMWEventEmitter = ProxyMWEventEmitter;
//# sourceMappingURL=http-proxy-mw-event-emitter.js.map