"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_map_1 = require("./data-map");
const proxy_request_1 = require("./proxy-request");
const proxy_response_1 = require("./proxy-response");
class ProxyContext {
    constructor() {
        this.response = new proxy_response_1.ProxyResponse();
        this.request = new proxy_request_1.ProxyRequest();
        this.dataMap = new data_map_1.DataMap();
    }
    toString() {
        let result = '';
        result += '---------------------------------------';
        result += 'context = {\n';
        if (this.error != null)
            result += `\terror: ${this.error.message}`;
        result += `\tresponse: ${this.response}`;
        result += `\trequest: ${this.request}`;
        result += `\tresponse: ${this.response}`;
        result += `\tresponse: ${this.response}`;
        result += `\tdataMap:`;
        if (this.dataMap != null)
            result += `${this.dataMap.toString()}`;
        result += '---------------------------------------';
        return result;
    }
}
exports.ProxyContext = ProxyContext;
//# sourceMappingURL=proxy-context.js.map