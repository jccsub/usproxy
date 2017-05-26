"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextMapperProxyRequestListener {
    constructor(parser, log) {
        this.log = log;
        this.parser = parser;
    }
    handleEvent(logger, context) {
        this.log.debug(`ContextMapperProxyRequestListener.handleEvent`);
        let proxyContext = context;
        if (proxyContext.request.body) {
            let parsedBody = this.parse(proxyContext.request.body);
            this.log.debug(`ContextMapperProxyRequestListener.handleEvent - body = ${proxyContext.request.body}`);
            proxyContext.dataMap.addContent(parsedBody);
        }
    }
    parse(body) {
        return this.parser.parse(body);
    }
}
exports.ContextMapperProxyRequestListener = ContextMapperProxyRequestListener;
//# sourceMappingURL=context-mapper.js.map