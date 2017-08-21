"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MarkupModifier {
    constructor(log, configuration) {
        this.configuration = configuration;
        this.log = log;
    }
    performModifications(url, req, res) {
        var getProcessorFunction = require('harmon');
        var func = getProcessorFunction([], this.getModificationQueryFunctions(url));
        func(req, res, () => { });
    }
    getModificationQueryFunctions(url) {
        let result = new Array();
        this.configuration.modifications.forEach((modification) => {
            if (modification.urlPattern.test(url)) {
                this.log.debug(`urlPattern matched...pattern:${modification.urlPattern}, url:${url}`);
                result.push(modification.convertToQueryFunction());
            }
            else {
                this.log.debug(`urlPattern NOT matched...pattern:${modification.urlPattern}, url:${url}`);
            }
        });
        return result;
    }
}
exports.MarkupModifier = MarkupModifier;
//# sourceMappingURL=markup-modifier.js.map