"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_request_1 = require("./infusion-request");
const infusion_response_1 = require("./infusion-response");
var InfusionContextDirection;
(function (InfusionContextDirection) {
    InfusionContextDirection[InfusionContextDirection["Request"] = 0] = "Request";
    InfusionContextDirection[InfusionContextDirection["Response"] = 1] = "Response";
})(InfusionContextDirection = exports.InfusionContextDirection || (exports.InfusionContextDirection = {}));
class InfusionContext {
    constructor(log) {
        this.response = new infusion_response_1.InfusionResponse();
        this.request = new infusion_request_1.InfusionRequest();
        this.modifications = new Array();
        this.rewritePath = '';
        this.log = log;
    }
    /* istanbul ignore next */
    toString() {
        let result = '';
        result += '\n---------------------------------------';
        result += '\ncontext = {\n';
        // tslint:disable-next-line:triple-equals
        if (this.error != null) {
            result += `\n\terror-message: ${this.error.message}`;
        }
        result += `\n\trequest-body: ${this.request.body}`;
        result += `\n\trequest-url: ${this.request.fullUrl}`;
        result += `\n\trequest-method: ${this.request.method}`;
        result += `\n\tresponse-headers: ${JSON.stringify(this.response.headers)}`;
        result += `\n\tdataMap:`;
        result += '\n---------------------------------------';
        return result;
    }
}
exports.InfusionContext = InfusionContext;
//# sourceMappingURL=infusion-context.js.map