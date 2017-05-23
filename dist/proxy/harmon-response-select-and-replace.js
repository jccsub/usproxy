"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HarmonResponseSelectAndReplaceFactory {
    create(log) {
        return new HarmonResponseSelectAndReplace(log);
    }
}
exports.HarmonResponseSelectAndReplaceFactory = HarmonResponseSelectAndReplaceFactory;
class HarmonResponseSelectAndReplace {
    constructor(log) {
        this.log = log;
        this.selectAndReplaceItems = new Array();
    }
    execute(req, res) {
        this.log.debug('execute()');
        var selects = this.convertSelectAndReplaceToQueryFunctionList(this.selectAndReplaceItems);
        this.log.debug(`execute() selects list count = ${selects.length}`);
        var replacer = require('harmon')([], selects);
        replacer(req, res, () => { });
    }
    addSelectAndReplaceItems(selectAndReplaceItems) {
        this.log.debug(`addSelectAndReplaceItems called - ${selectAndReplaceItems.length} items`);
        // tslint:disable-next-line:triple-equals
        if (selectAndReplaceItems == null) {
            throw new Error('selectAndReplaceItems must be assigned');
        }
        this.selectAndReplaceItems = this.selectAndReplaceItems.concat(selectAndReplaceItems);
    }
    convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems) {
        this.log.debug(`convertSelectAndReplaceToQueryFunctionList called with ${selectAndReplaceItems.length} items`);
        let selects = [];
        selectAndReplaceItems.forEach((item) => {
            let singleSelect = {};
            singleSelect.query = item.select;
            singleSelect.func = (node) => {
                node.createWriteStream().end(item.replace);
            };
            selects.push(singleSelect);
        });
        return selects;
    }
}
exports.HarmonResponseSelectAndReplace = HarmonResponseSelectAndReplace;
//# sourceMappingURL=harmon-response-select-and-replace.js.map