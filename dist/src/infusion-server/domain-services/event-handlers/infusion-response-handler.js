"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionResponseHandler {
    constructor(log) {
        this.log = log;
    }
    onData(chunk) {
        this.log.debug(`InfusionResponseHandler.onData`);
    }
    onEnd() {
        this.log.debug(`InfusionResponseHandler.onEnd`);
    }
}
exports.InfusionResponseHandler = InfusionResponseHandler;
//# sourceMappingURL=infusion-response-handler.js.map