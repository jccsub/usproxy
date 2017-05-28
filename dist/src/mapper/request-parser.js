"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestParser {
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
exports.RequestParser = RequestParser;
//# sourceMappingURL=request-parser.js.map