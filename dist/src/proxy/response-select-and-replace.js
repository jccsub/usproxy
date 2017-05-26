"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlChangeType;
(function (HtmlChangeType) {
    HtmlChangeType[HtmlChangeType["Replace"] = 0] = "Replace";
    HtmlChangeType[HtmlChangeType["Append"] = 1] = "Append";
})(HtmlChangeType = exports.HtmlChangeType || (exports.HtmlChangeType = {}));
class HtmlModification {
    constructor(select, replace, changeType) {
        this.select = select;
        this.newText = replace;
        this.changeType = changeType;
    }
}
exports.HtmlModification = HtmlModification;
//# sourceMappingURL=response-select-and-replace.js.map