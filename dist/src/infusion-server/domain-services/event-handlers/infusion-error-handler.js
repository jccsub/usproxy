"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionErrorHandler {
    constructor(log) {
        this.log = log;
    }
    handle(err, req, res) {
        this.log.debug(`InfusionErrorHandler.handle`);
    }
}
exports.InfusionErrorHandler = InfusionErrorHandler;
//# sourceMappingURL=infusion-error-handler.js.map