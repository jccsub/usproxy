"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonDataMap {
    constructor(log) {
        this.content = {};
        this.log = log;
    }
    toString() {
        let value;
        value = '{';
        for (var key in this.content) {
            value += `\n\t${key} : ${this.content[key]},`;
        }
        value += '\n}';
        return value;
    }
    addContent(jsonContent) {
        for (var key in jsonContent) {
            this.content[key] = jsonContent[key];
        }
    }
}
exports.JsonDataMap = JsonDataMap;
//# sourceMappingURL=json-data-map.js.map