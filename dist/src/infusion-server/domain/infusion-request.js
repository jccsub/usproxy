"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionRequest {
    get fullUrl() { return `${this.protocol}://${this.host}${this.url}`; }
}
exports.InfusionRequest = InfusionRequest;
//# sourceMappingURL=infusion-request.js.map