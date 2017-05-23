"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectAndReplaceItem {
    constructor(selector, replacement) {
        this.selector = selector;
        this.replacement = replacement;
    }
    get cssSelector() { return this.selector; }
    ;
    get replacementHtml() { return this.replacement; }
    get urlPattern() { return this.urlRegEx; }
}
exports.SelectAndReplaceItem = SelectAndReplaceItem;
//# sourceMappingURL=streaming-html-middleware.js.map