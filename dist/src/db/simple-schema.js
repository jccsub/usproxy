"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleColumnDataTypes;
(function (SimpleColumnDataTypes) {
    SimpleColumnDataTypes[SimpleColumnDataTypes["int"] = 0] = "int";
    SimpleColumnDataTypes[SimpleColumnDataTypes["uniqueidentifier"] = 1] = "uniqueidentifier";
    SimpleColumnDataTypes[SimpleColumnDataTypes["string255"] = 2] = "string255";
    SimpleColumnDataTypes[SimpleColumnDataTypes["string1024"] = 3] = "string1024";
    SimpleColumnDataTypes[SimpleColumnDataTypes["stringMax"] = 4] = "stringMax";
})(SimpleColumnDataTypes = exports.SimpleColumnDataTypes || (exports.SimpleColumnDataTypes = {}));
var SimpleColumnAttributes;
(function (SimpleColumnAttributes) {
    SimpleColumnAttributes[SimpleColumnAttributes["identity"] = 1] = "identity";
    SimpleColumnAttributes[SimpleColumnAttributes["primaryKey"] = 2] = "primaryKey";
})(SimpleColumnAttributes = exports.SimpleColumnAttributes || (exports.SimpleColumnAttributes = {}));
class SimpleColumn {
    getDefinition() {
        let def = `${this.columnName} `;
        switch (this.dataType) {
            case SimpleColumnDataTypes.int: {
                def += 'int ';
                break;
            }
            case SimpleColumnDataTypes.string1024: {
                def += 'varchar(1024) ';
                break;
            }
            case SimpleColumnDataTypes.string255: {
                def += 'varchar(255) ';
                break;
            }
            case SimpleColumnDataTypes.stringMax: {
                def += 'varchar(MAX) ';
                break;
            }
            case SimpleColumnDataTypes.uniqueidentifier: {
                def += 'uniqueidentifier ';
                break;
            }
            default: {
                throw new Error(`SimpleColumn.getDefinition() - Not a valid data type for ${def} : ${this.dataType}`);
            }
        }
        if (this.attributes & SimpleColumnAttributes.primaryKey) {
            def += 'not null primary key ';
        }
        if (this.attributes & SimpleColumnAttributes.identity) {
            switch (this.dataType) {
                case SimpleColumnDataTypes.int: {
                    def += 'identity(1,1) ';
                    break;
                }
                case SimpleColumnDataTypes.uniqueidentifier: {
                    def += 'defalt newid() ';
                }
                default: {
                    throw new Error(`SimpleColumn.getDefinition() - Identity must be either an int or uniqueidentifier: ${def}`);
                }
            }
        }
        else {
            if (!(this.attributes & SimpleColumnAttributes.primaryKey)) {
                def += 'not null ';
            }
        }
        return def;
    }
}
exports.SimpleColumn = SimpleColumn;
//# sourceMappingURL=simple-schema.js.map