"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyListener {
    handleEvent(logger, context) {
        logger.debug('Base handleEvent');
        throw new Error('Not implemented');
    }
}
exports.ProxyListener = ProxyListener;
class ResponseSelectAndReplace {
    constructor(cssSelectString, replaceString) {
        this.cssSelectString = cssSelectString;
        this.replaceString = replaceString;
    }
}
exports.ResponseSelectAndReplace = ResponseSelectAndReplace;
//# sourceMappingURL=proxy-listener.js.map