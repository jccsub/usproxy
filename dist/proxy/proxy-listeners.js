"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_listener_1 = require("./proxy-listener");
var httpProxy = require('http-proxy');
class ProxyListeners {
    constructor(logger) {
        this.errorProxyListeners = [];
        this.parseProxyListeners = [];
        this.redirectProxyListeners = [];
        this.requestProxyListeners = [];
        this.responseProxyListeners = [];
        this.responseSelectAndReplace = [];
        this.log = logger;
        this.log.debug(`ProxyListeners.constructor(${logger})`);
    }
    addListener(proxyListener) {
        this.log.debug(`ProxyListeners.addListener(${typeof proxyListener})`);
        if (proxyListener instanceof proxy_listener_1.ErrorProxyListener) {
            this.addErrorListener(proxyListener);
        }
        else if (proxyListener instanceof proxy_listener_1.ParseProxyListener) {
            this.addParseListener(proxyListener);
        }
        else if (proxyListener instanceof proxy_listener_1.RedirectProxyListener) {
            this.addRedirectListener(proxyListener);
        }
        else if (proxyListener instanceof proxy_listener_1.RequestProxyListener) {
            this.addRequestListener(proxyListener);
        }
        else if (proxyListener instanceof proxy_listener_1.ResponseProxyListener) {
            this.addResponseListener(proxyListener);
        }
        else
            throw new Error(`Could not determine kind of load proxy listener`);
    }
    addErrorListener(listener) {
        this.errorProxyListeners.push(listener);
    }
    addParseListener(listener) {
        this.parseProxyListeners.push(listener);
    }
    addRedirectListener(listener) {
        this.redirectProxyListeners.push(listener);
    }
    addRequestListener(listener) {
        this.requestProxyListeners.push(listener);
    }
    addResponseListener(listener) {
        this.responseProxyListeners.push(listener);
    }
    addResponseSelectAndReplace(cssSelect, replaceString) {
        this.responseSelectAndReplace.push(new proxy_listener_1.ResponseSelectAndReplace(cssSelect, replaceString));
    }
}
exports.ProxyListeners = ProxyListeners;
//# sourceMappingURL=proxy-listeners.js.map