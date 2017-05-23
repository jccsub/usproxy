"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_map_1 = require("./data-map");
const proxy_request_1 = require("./proxy-request");
const proxy_response_1 = require("./proxy-response");
class ProxyContext {
    constructor() {
        this.response = new proxy_response_1.ProxyResponse();
        this.request = new proxy_request_1.ProxyRequest();
        this.selectAndReplaceItems = new Array();
        this.rewritePath = '';
        this.dataMap = new data_map_1.DataMap();
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
        // tslint:disable-next-line:triple-equals
        if (this.dataMap != null) {
            result += `\n${this.dataMap.toString()}`;
        }
        result += '\n---------------------------------------';
        return result;
    }
}
exports.ProxyContext = ProxyContext;
//# sourceMappingURL=proxy-context.js.map