"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionPathRewriteHandler {
    constructor(log) {
        this.log = log;
    }
    handle(path, req) {
        this.log.debug(`InfusionPathRewriteHandler.handle`);
    }
}
exports.InfusionPathRewriteHandler = InfusionPathRewriteHandler;
//# sourceMappingURL=infusion-path-rewrite-handler.js.map