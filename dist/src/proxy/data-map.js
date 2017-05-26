"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataMap {
    constructor(log) {
        this.log = log;
    }
    toString() {
        return 'dataMap: {Empty}';
    }
    addContent(jsonContent) {
        this.log.debug('adding Content to DataMap: ');
        this.log.debug(jsonContent);
    }
}
exports.DataMap = DataMap;
//# sourceMappingURL=data-map.js.map