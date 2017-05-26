"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockDataMap {
    constructor() {
        this.content = {};
    }
    toString() {
        return 'MockDataMap.toString()';
    }
    addContent(jsonContent) {
        for (var key in jsonContent) {
            this.content[key] = jsonContent[key];
        }
    }
}
exports.MockDataMap = MockDataMap;
//# sourceMappingURL=mock-datamap.js.map