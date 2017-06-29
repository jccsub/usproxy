"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_schema_1 = require("./simple-schema");
class SimpleSchemaValidator {
    constructor(tableSchema) {
        this.tableSchema = tableSchema;
    }
    validate(data) {
        this.tableSchema.forEach((column) => {
            this.validateColumnExists(data, column.columnName);
            switch (column.dataType) {
                case simple_schema_1.SimpleColumnDataTypes.int:
                    this.validateIntValue(data[data.columnName]);
                    break;
                case simple_schema_1.SimpleColumnDataTypes.string1024:
                case simple_schema_1.SimpleColumnDataTypes.string255:
                case simple_schema_1.SimpleColumnDataTypes.stringMax:
                    this.validateStringValue(data[data.columnName]);
                    break;
                case simple_schema_1.SimpleColumnDataTypes.uniqueidentifier:
                    this.validateUuidValue(data[column.columnName]);
                    break;
                default:
                    throw new Error(`SqlDataWriter.massageDataToBeInserted - Unexpected column data type: ${column.dataType}`);
            }
        });
        return data;
    }
    validateIntValue(value) {
        if (!(Number(value) === value && value % 1 === 0)) {
            throw new Error(`sqlDataWriter.validateIntValue - unexpected int value : ${value}`);
        }
    }
    validateStringValue(value) {
        // tslint:disable-next-line:triple-equals
        if (value == null) {
            throw new Error(`sqlDataWriter.validateStringValue - expected non-null value`);
        }
    }
    validateUuidValue(value) {
        var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!pattern.test(value)) {
            throw new Error(`sqlDataWriter.validateUuidValue - unexpected uuid value: ${value}`);
        }
    }
    validateColumnExists(data, propertyName) {
        if (!data.hasOwnProperty(propertyName)) {
            throw new Error(`SqlDataWriter.validateColumnExists - column does not exist: ${propertyName}`);
        }
    }
}
exports.SimpleSchemaValidator = SimpleSchemaValidator;
//# sourceMappingURL=simple-schema-validator.js.map