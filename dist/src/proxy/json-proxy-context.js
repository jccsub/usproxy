"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_data_map_1 = require("../mapper/json-data-map");
const proxy_request_1 = require("./proxy-request");
const proxy_response_1 = require("./proxy-response");
class JsonProxyContext {
    constructor(log) {
        this.response = new proxy_response_1.ProxyResponse();
        this.request = new proxy_request_1.ProxyRequest();
        this.selectAndReplaceItems = new Array();
        this.rewritePath = '';
        this.log = log;
        this.dataMap = new json_data_map_1.JsonDataMap(log);
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
exports.JsonProxyContext = JsonProxyContext;
//# sourceMappingURL=json-proxy-context.js.map