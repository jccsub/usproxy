"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_response_handler_1 = require("./infusion-response-handler");
class InfusionProxyResponseHandler {
    constructor(log) {
        this.log = log;
    }
    handle(proxyRes, req, res) {
        this.log.debug(`InfusionProxyResponseHandler.handle`);
        let resHandler = new infusion_response_handler_1.InfusionResponseHandler(this.log);
        proxyRes.on('data', (chunk) => {
            resHandler.onData(chunk);
        });
        proxyRes.on('end', () => {
            resHandler.onEnd();
        });
    }
}
exports.InfusionProxyResponseHandler = InfusionProxyResponseHandler;
//# sourceMappingURL=infusion-proxy-response-handler.js.map