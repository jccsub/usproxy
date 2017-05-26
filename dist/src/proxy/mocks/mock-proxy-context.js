"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_datamap_1 = require("./mock-datamap");
const proxy_request_1 = require("../proxy-request");
const proxy_response_1 = require("../proxy-response");
class MockProxyContext {
    constructor(log) {
        this.response = new proxy_response_1.ProxyResponse();
        this.request = new proxy_request_1.ProxyRequest();
        this.selectAndReplaceItems = new Array();
        this.rewritePath = '';
        this.dataMap = new mock_datamap_1.MockDataMap();
        this.log = log;
    }
    toString() {
        console.log('MockProxyContext.toString()');
    }
}
exports.MockProxyContext = MockProxyContext;
//# sourceMappingURL=mock-proxy-context.js.map