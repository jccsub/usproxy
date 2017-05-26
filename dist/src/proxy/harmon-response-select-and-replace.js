"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_select_and_replace_1 = require("./response-select-and-replace");
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
                if (item.changeType === response_select_and_replace_1.HtmlChangeType.Append) {
                    this.append(node, item.newText);
                }
                else {
                    this.replace(node, item.newText);
                }
            };
            selects.push(singleSelect);
        });
        return selects;
    }
    replace(node, newText) {
        node.createWriteStream().end(newText);
    }
    append(node, newText) {
        var rs = node.createReadStream();
        var ws = node.createWriteStream({ outer: false });
        // Read the node and put it back into our write stream, 
        // but don't end the write stream when the readStream is closed.
        rs.pipe(ws, { end: false });
        // When the read stream has ended, attach our style to the end
        rs.on('end', function () {
            ws.end(newText);
        });
    }
}
exports.HarmonResponseSelectAndReplace = HarmonResponseSelectAndReplace;
//# sourceMappingURL=harmon-response-select-and-replace.js.map