"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyListener {
}
exports.ProxyListener = ProxyListener;
class ErrorProxyListener extends ProxyListener {
}
exports.ErrorProxyListener = ErrorProxyListener;
;
class ParseProxyListener extends ProxyListener {
}
exports.ParseProxyListener = ParseProxyListener;
;
class RedirectProxyListener extends ProxyListener {
}
exports.RedirectProxyListener = RedirectProxyListener;
;
class RequestProxyListener extends ProxyListener {
}
exports.RequestProxyListener = RequestProxyListener;
;
class ResponseProxyListener extends ProxyListener {
}
exports.ResponseProxyListener = ResponseProxyListener;
;
class ResponseSelectAndReplace {
    constructor(cssSelectString, replaceString) {
        this.cssSelectString = cssSelectString;
        this.replaceString = replaceString;
    }
}
exports.ResponseSelectAndReplace = ResponseSelectAndReplace;
//# sourceMappingURL=proxy-listener.js.map