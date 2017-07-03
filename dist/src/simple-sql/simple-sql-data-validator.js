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
const simple_schema_1 = require("./simple-schema");
const guards_1 = require("../utils/guards");
class SimpleSqlDataValidator {
    constructor(tableSchema, log) {
        this.tableSchema = tableSchema;
        this.log = log;
    }
    validate(data) {
        this.tableSchema.forEach((column) => {
            this.validateColumnExistence(data, column);
            if (column.isIdentity()) {
                this.validateNoValueForIdentityColumn(column, data);
                return;
            }
            // tslint:disable-next-line:triple-equals
            if (column.isOptional() && (data[column.columnName] == null)) {
                return;
            }
            try {
                switch (column.dataType) {
                    case simple_schema_1.SimpleColumnDataType.int:
                        this.validateIntValue(data[column.columnName]);
                        break;
                    case simple_schema_1.SimpleColumnDataType.string1024:
                        this.validateStringValue(data[column.columnName], 1024);
                        break;
                    case simple_schema_1.SimpleColumnDataType.string255:
                        this.validateStringValue(data[column.columnName], 255);
                        break;
                    case simple_schema_1.SimpleColumnDataType.string4096:
                        this.validateStringValue(data[column.columnName], 4096);
                        break;
                    case simple_schema_1.SimpleColumnDataType.char:
                        this.validateStringValue(data[column.columnName], 1);
                        break;
                    case simple_schema_1.SimpleColumnDataType.stringMax:
                        this.validateStringValue(data[column.columnName]);
                        break;
                    case simple_schema_1.SimpleColumnDataType.uniqueidentifier:
                        this.validateUuidValue(data[column.columnName]);
                        break;
                    default:
                        throw new Error(`SimpleSchemaValidator.validate - Unexpected column data type: ${column.dataType}`);
                }
            }
            catch (err) {
                throw new Error(`validateData error on column ${column.columnName} : ${err.message} `);
            }
        });
        return data;
    }
    validateNoValueForIdentityColumn(column, data) {
        // tslint:disable-next-line:triple-equals
        if (column.isPrimaryKey() && (data[column.columnName] != null)) {
            throw new Error(`SimpleSchemaValidator.validateNoValueForIdentityColumn - identity column cannot have a value`);
        }
    }
    validateIntValue(value) {
        if (!(Number(value) === value && value % 1 === 0)) {
            throw new Error(`SimpleSchemaValidator.validateIntValue - unexpected int value : ${value}`);
        }
    }
    validateStringValue(value, length) {
        // tslint:disable-next-line:triple-equals
        if (value == null) {
            throw new Error(`SimpleSchemaValidator.validateStringValue - expected non-null value`);
        }
        if ((length) && (value.length > length)) {
            throw new Error(`SimpleSchemaValidator.validateStringValue - maximum length is ${length} characters but value is ${value.length} characters for : '${value}'`);
        }
    }
    validateUuidValue(value) {
        var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!pattern.test(value)) {
            throw new Error(`SimpleSchemaValidator.validateUuidValue - unexpected uuid value: ${value}`);
        }
    }
    validateColumnExistence(data, column) {
        if (!column.isOptional() && !column.isIdentity() && !data.hasOwnProperty(column.columnName)) {
            throw new Error(`SimpleSchemaValidator.validateColumnExistence - required column does not exist in the data: ${column.columnName}`);
        }
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.isJson),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SimpleSqlDataValidator.prototype, "validate", null);
exports.SimpleSqlDataValidator = SimpleSqlDataValidator;
//# sourceMappingURL=simple-sql-data-validator.js.map