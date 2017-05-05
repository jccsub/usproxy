"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const harmon = require("harmon");
class HarmonStreamingHtmlMiddleware {
    constructor(log) {
        this.log = log;
        this.selectAndReplaceItems = new Array();
    }
    /* istanbul ignore next */
    get selectAndReplaceCallback() {
        let selectAndReplaceParams = [];
        this.selectAndReplaceItems.forEach(selectAndReplaceItem => {
            let item = {};
            item.query = selectAndReplaceItem.cssSelector;
            item.func = (node) => {
                node.createWriteStream().end(selectAndReplaceItem.replacementHtml);
            };
            selectAndReplaceParams.push(item);
        });
        return harmon([], selectAndReplaceParams);
    }
}
exports.HarmonStreamingHtmlMiddleware = HarmonStreamingHtmlMiddleware;
//# sourceMappingURL=harmon-streaming-html-middleware.js.map