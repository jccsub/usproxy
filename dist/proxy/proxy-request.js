"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyRequest {
    get fullUrl() { return `${this.protocol}://${this.host}${this.url}`; }
}
exports.ProxyRequest = ProxyRequest;
//# sourceMappingURL=proxy-request.js.map