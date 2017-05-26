"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UriRequestParser {
    constructor(log) {
        this.log = log;
    }
    parse(requestString) {
        var query = {};
        var a = (requestString[0] === '?' ? requestString.substr(1) : requestString).split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }
}
exports.UriRequestParser = UriRequestParser;
//# sourceMappingURL=uri-request-parser.js.map