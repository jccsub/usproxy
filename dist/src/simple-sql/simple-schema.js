"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleColumnDataType;
(function (SimpleColumnDataType) {
    SimpleColumnDataType[SimpleColumnDataType["int"] = 0] = "int";
    SimpleColumnDataType[SimpleColumnDataType["uniqueidentifier"] = 1] = "uniqueidentifier";
    SimpleColumnDataType[SimpleColumnDataType["string255"] = 2] = "string255";
    SimpleColumnDataType[SimpleColumnDataType["string1024"] = 3] = "string1024";
    SimpleColumnDataType[SimpleColumnDataType["string4096"] = 4] = "string4096";
    SimpleColumnDataType[SimpleColumnDataType["char"] = 5] = "char";
    SimpleColumnDataType[SimpleColumnDataType["stringMax"] = 6] = "stringMax";
})(SimpleColumnDataType = exports.SimpleColumnDataType || (exports.SimpleColumnDataType = {}));
var SimpleColumnAttributes;
(function (SimpleColumnAttributes) {
    SimpleColumnAttributes[SimpleColumnAttributes["identity"] = 1] = "identity";
    SimpleColumnAttributes[SimpleColumnAttributes["primaryKey"] = 2] = "primaryKey";
    SimpleColumnAttributes[SimpleColumnAttributes["optional"] = 4] = "optional";
})(SimpleColumnAttributes = exports.SimpleColumnAttributes || (exports.SimpleColumnAttributes = {}));
class SimpleColumn {
    constructor(columnName, dataType, attributes = 0) {
        this._attributes = 0;
        this.columnName = columnName;
        this.dataType = dataType;
        this.attributes = attributes;
    }
    get attributes() {
        return this._attributes;
    }
    set attributes(attributes) {
        this.validateAttributes(attributes);
        this._attributes = attributes;
    }
    isIdentity() {
        return (this.attributes & SimpleColumnAttributes.identity) === SimpleColumnAttributes.identity;
    }
    isPrimaryKey() {
        return (this.attributes & SimpleColumnAttributes.primaryKey) === SimpleColumnAttributes.primaryKey;
    }
    isOptional() {
        return (this.attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional;
    }
    validateAttributes(attributes) {
        if (((attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional) &&
            ((attributes & SimpleColumnAttributes.primaryKey) === SimpleColumnAttributes.primaryKey)) {
            throw new Error('A column cannot be both primary key and optional. If it is a ' +
                'primary key then it is either an identity and must not be provided or it is not an identity and ' +
                'must be provided.');
        }
        if (((attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional) &&
            ((attributes & SimpleColumnAttributes.identity) === SimpleColumnAttributes.identity)) {
            throw new Error('A column cannot be both an identity and optional. If it is an ' +
                'identity then it must not be provided');
        }
    }
}
exports.SimpleColumn = SimpleColumn;
//# sourceMappingURL=simple-schema.js.map