"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InfusionModificationType;
(function (InfusionModificationType) {
    InfusionModificationType[InfusionModificationType["Replace"] = 0] = "Replace";
    InfusionModificationType[InfusionModificationType["Append"] = 1] = "Append";
})(InfusionModificationType = exports.InfusionModificationType || (exports.InfusionModificationType = {}));
class InfusionModification {
    constructor(cssQuery, newMarkup, modificationType, urlPattern) {
        this.newMarkup = newMarkup;
        this.cssQuery = cssQuery;
        this.modificationType = modificationType;
        this.urlPattern = urlPattern;
    }
    convertToQueryFunction() {
        let select = {};
        select.query = this.cssQuery;
        select.func = (node) => {
            if (this.modificationType === InfusionModificationType.Append) {
                this.append(node, this.newMarkup);
            }
            else {
                this.replace(node, this.newMarkup);
            }
        };
        return select;
    }
    replace(node, newText) {
        node.createWriteStream().end(newText);
    }
    append(node, newMarkup) {
        var rs = node.createReadStream();
        var ws = node.createWriteStream({ outer: false });
        // Read the node and put it back into our write stream, 
        // but don't end the write stream when the readStream is closed.
        rs.pipe(ws, { end: false });
        // When the read stream has ended, attach our style to the end
        rs.on('end', function () {
            ws.end(newMarkup);
        });
    }
}
exports.InfusionModification = InfusionModification;
//# sourceMappingURL=infusion-modification.js.map