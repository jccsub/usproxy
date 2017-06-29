"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("./misc");
var guardTypes = new Map();
/* istanbul ignore next */
function notNull(target, key, index) {
    var metadataKey = `notNull_${key}_parameters`;
    // tslint:disable-next-line:triple-equals
    if (target[metadataKey] == null) {
        target[metadataKey] = [];
    }
    target[metadataKey].push(index);
}
exports.notNull = notNull;
/* istanbul ignore next */
function isJson(target, key, index) {
    var metadataKey = `isJson_${key}_parameters`;
    // tslint:disable-next-line:triple-equals
    if (target[metadataKey] == null) {
        target[metadataKey] = [];
    }
    target[metadataKey].push(index);
}
exports.isJson = isJson;
/* istanbul ignore next */
guardTypes.set('notNull', (target, key, index, value) => {
    if (value === undefined) {
        throw new Error(`${target.constructor.name}.${key}, value at argument ${index} cannot be undefined`);
    }
    if (value === null) {
        throw new Error(`${target.constructor.name}.${key} expects non null value at argument ${index}, but was found to be ${JSON.stringify(value) || value.toString()}`);
    }
});
/* istanbul ignore next */
guardTypes.set('isJson', (target, key, index, value) => {
    // tslint:disable-next-line:triple-equals
    if (value === undefined) {
        throw new Error(`${target.constructor.name}.${key}, JSON value at argument ${index} cannot be undefined`);
    }
    if (!misc_1.isJsonValue(value)) {
        throw new Error(`${target.constructor.name}.${key} expects json type value at argument ${index}, but was instead = ${JSON.stringify(value) || value.toString()}`);
    }
});
/* istanbul ignore next */
function guarded(target, key, descriptor) {
    guardTypes.forEach((validation, guardType) => {
        checkParameterDecorators(guardType, validation, target, key, descriptor);
    });
}
exports.guarded = guarded;
/* istanbul ignore next */
function checkParameterDecorators(guardType, validation, target, key, descriptor) {
    const originalMethod = descriptor.value; // save a reference to the original method
    var metadataKey = `${guardType}_${key}_parameters`;
    var indices = target[metadataKey];
    // tslint:disable-next-line:triple-equals
    if (indices == null) {
        return;
    }
    var result;
    // NOTE: Do not use arrow syntax here. Use a function expression in 
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function (...args) {
        if (Array.isArray(indices)) {
            for (var i = 0; i < args.length; i++) {
                if (indices.indexOf(i) !== -1) {
                    validation(target, key, i, args[i]);
                }
            }
            result = originalMethod.apply(this, args);
            return result;
        }
        else {
            var a = args[0];
            validation(target, key, 0, a);
            result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            return result;
        }
    };
}
//# sourceMappingURL=guards.js.map