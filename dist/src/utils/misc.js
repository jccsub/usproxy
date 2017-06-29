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
function generateUuid() {
    let newid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:triple-equals
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return newid;
}
exports.generateUuid = generateUuid;
function expectException(func) {
    try {
        func();
    }
    catch (err) {
        return;
    }
    throw new Error('Expected exception');
}
exports.expectException = expectException;
//# sourceMappingURL=misc.js.map