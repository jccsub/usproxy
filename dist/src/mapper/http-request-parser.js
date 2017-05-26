"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require('http-string-parser');
class HttpRequestParser {
    constructor(log) {
        this.log = log;
    }
    print(obj) {
        var propValue;
        for (var propName in obj) {
            propValue = obj[propName];
            console.log(propName, propValue);
        }
    }
    parse(requestString) {
        this.log.debug(`HttpRequestParser.parse - requestString = ${requestString}`);
        let parsed = parser.parseRequest(requestString);
        this.print(parsed);
    }
}
exports.HttpRequestParser = HttpRequestParser;
//# sourceMappingURL=http-request-parser.js.map