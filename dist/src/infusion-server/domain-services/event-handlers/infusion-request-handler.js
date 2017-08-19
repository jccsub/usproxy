"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionRequestHandler {
    constructor(log, req, context) {
        this.dataAvailable = false;
        this.log = log;
        this.req = req;
        this.context = context;
        this.context.request.body = '';
    }
    onData(chunk) {
        this.log.debug(`InfusionRequestHandler.onData`);
        this.dataAvailable = true;
        this.context.request.body += chunk;
    }
    onEnd() {
        this.log.debug(`InfusionRequestHandler.onEnd`);
        this.populateContextWithReq(this.context, this.req);
        this.log.debug(this.context.toString());
    }
    populateContextWithReq(context, req) {
        this.context.request.url = this.req.url;
        this.context.request.host = this.req.headers.host;
        this.context.request.protocol = 'http';
        this.context.request.method = this.req.method;
    }
}
exports.InfusionRequestHandler = InfusionRequestHandler;
//# sourceMappingURL=infusion-request-handler.js.map