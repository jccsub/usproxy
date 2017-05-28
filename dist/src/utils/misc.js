"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJsonValue(value) {
    try {
        if (value && typeof value === 'object' && value !== null) {
            return true;
        }
        var obj = JSON.parse(value);
        if (obj && typeof obj === 'object' && obj !== null) {
            return true;
        }
    }
    catch (err) { }
    return false;
}
exports.isJsonValue = isJsonValue;
//# sourceMappingURL=misc.js.map