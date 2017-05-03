"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streaming_html_middleware_1 = require("../utils/streaming-html-middleware");
var httpProxy = require('http-proxy');
class ProxyListenerCollection {
    constructor(logger) {
        this.errorProxyListeners = [];
        this.parseProxyListeners = [];
        this.redirectProxyListeners = [];
        this.requestProxyListeners = [];
        this.responseProxyListeners = [];
        this.responseSelectAndReplace = [];
        this.log = logger;
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
        this.log.debug(`adding ${cssSelect}`);
        this.responseSelectAndReplace.push(new streaming_html_middleware_1.SelectAndReplaceItem(cssSelect, replaceString));
    }
}
exports.ProxyListenerCollection = ProxyListenerCollection;
//# sourceMappingURL=proxy-listener-collection.js.map