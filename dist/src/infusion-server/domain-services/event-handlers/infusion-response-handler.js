"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionResponseHandler {
    constructor(log, context, proxyRes) {
        this.log = log;
        this.context = context;
        this.proxyRes = proxyRes;
    }
    onData(chunk) {
        this.log.debug(`InfusionResponseHandler.onData`);
        this.context.response.body += chunk.toString('utf8');
    }
    onEnd() {
        this.log.debug(`InfusionResponseHandler.onEnd`);
        this.context.response.statusCode = this.proxyRes.statusCode;
        this.context.response.headers = this.proxyRes.headers;
    }
}
exports.InfusionResponseHandler = InfusionResponseHandler;
//# sourceMappingURL=infusion-response-handler.js.map