"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MarkupModifier {
    constructor(configuration) {
        this.configuration = configuration;
    }
    performModifications(req, res) {
        var getProcessorFunction = require('harmon');
        var func = getProcessorFunction([], this.getModificationQueryFunctions());
        func(req, res, () => { });
    }
    getModificationQueryFunctions() {
        let result = new Array();
        this.configuration.modifications.forEach((modification) => {
            result.push(modification.convertToQueryFunction());
        });
        return result;
    }
}
exports.MarkupModifier = MarkupModifier;
//# sourceMappingURL=markup-modifier.js.map