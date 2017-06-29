"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const guards_1 = require("../utils/guards");
const response_select_and_replace_1 = require("./response-select-and-replace");
class HtmlResponseSelectAndReplace {
    constructor(replacerFactory, log) {
        this.log = log;
        this.selectAndReplaceItems = new Array();
        this.replacerFactory = replacerFactory;
    }
    execute(req, res) {
        var selects = this.convertSelectAndReplaceToQueryFunctionList(this.selectAndReplaceItems);
        var replacer = this.replacerFactory([], selects);
        replacer(req, res, () => { });
    }
    addSelectAndReplaceItems(selectAndReplaceItems) {
        this.selectAndReplaceItems = this.selectAndReplaceItems.concat(selectAndReplaceItems);
    }
    /* istanbul ignore next */
    convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems) {
        let selects = [];
        selectAndReplaceItems.forEach((item) => {
            let singleSelect = {};
            singleSelect.query = item.select;
            singleSelect.func = (node) => {
                if (item.changeType === response_select_and_replace_1.SelectAndReplaceType.Append) {
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
    /* istanbul ignore next */
    replace(node, newText) {
        node.createWriteStream().end(newText);
    }
    /* istanbul ignore next */
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
__decorate([
    guards_1.guarded,
    __param(0, guards_1.notNull), __param(1, guards_1.notNull),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplace.prototype, "execute", null);
exports.HtmlResponseSelectAndReplace = HtmlResponseSelectAndReplace;
class HtmlResponseSelectAndReplaceFactory {
    /* istanbul ignore next */
    create(log) {
        return new HtmlResponseSelectAndReplace(require('harmon'), log);
    }
}
exports.HtmlResponseSelectAndReplaceFactory = HtmlResponseSelectAndReplaceFactory;
//# sourceMappingURL=html-response-select-and-replace.js.map