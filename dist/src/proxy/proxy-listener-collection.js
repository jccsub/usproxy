"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpProxy = require('http-proxy');
class ProxyListenerCollection {
    constructor(logger) {
        this.errorProxyListeners = [];
        this.requestProxyListeners = [];
        this.responseProxyListeners = [];
        this.selectAndReplaceListeners = [];
        this.pathRewriteListeners = [];
        this.log = logger;
    }
    addErrorListener(listener) {
        this.errorProxyListeners.push(listener);
    }
    addRequestListener(listener) {
        this.requestProxyListeners.push(listener);
    }
    addResponseListener(listener) {
        this.responseProxyListeners.push(listener);
    }
    addSelectAndReplaceListener(listener) {
        this.selectAndReplaceListeners.push(listener);
    }
    addPathRewriteListener(listener) {
        this.pathRewriteListeners.push(listener);
    }
}
exports.ProxyListenerCollection = ProxyListenerCollection;
//# sourceMappingURL=proxy-listener-collection.js.map