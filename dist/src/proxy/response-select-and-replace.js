"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SelectAndReplaceType;
(function (SelectAndReplaceType) {
    SelectAndReplaceType[SelectAndReplaceType["Replace"] = 0] = "Replace";
    SelectAndReplaceType[SelectAndReplaceType["Append"] = 1] = "Append";
})(SelectAndReplaceType = exports.SelectAndReplaceType || (exports.SelectAndReplaceType = {}));
class SelectAndReplaceItem {
    constructor(select, replace, changeType) {
        this.select = select;
        this.newText = replace;
        this.changeType = changeType;
    }
}
exports.SelectAndReplaceItem = SelectAndReplaceItem;
//# sourceMappingURL=response-select-and-replace.js.map