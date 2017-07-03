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
const simple_schema_1 = require("./simple-schema");
const misc_1 = require("../utils/misc");
class SimpleSqlInsertGenerator {
    constructor(tableName, tableSchema, validator, log) {
        this.tableName = tableName;
        this.tableSchema = tableSchema;
        this.validator = validator;
        this.log = log;
    }
    generateInsertStatement(data) {
        this.validator.validate(data);
        return this.generateInsertColumnsPart(data) + this.generateInsertValuesPart(data);
    }
    generateInsertColumnsPart(data) {
        let insert = `insert into [${this.tableName}] (`;
        let first = true;
        this.tableSchema.forEach((column) => {
            let columnUsed = this.columnIsUsedInInsert(column, data);
            insert += misc_1.getCommaIfNeeded(!first && columnUsed);
            if (columnUsed) {
                first = false;
                insert += `[${column.columnName}]`;
            }
        });
        insert += ')';
        return insert;
    }
    generateInsertValuesPart(data) {
        let insert = ` values (`;
        let first = true;
        this.tableSchema.forEach((column) => {
            let columnUsed = this.columnIsUsedInInsert(column, data);
            insert += misc_1.getCommaIfNeeded(!first && columnUsed);
            if (columnUsed) {
                first = false;
                insert += (column.dataType !== simple_schema_1.SimpleColumnDataType.int) ? `'${data[column.columnName]}'` : `${data[column.columnName]}`;
            }
        });
        insert += ')';
        return insert;
    }
    columnIsUsedInInsert(column, data) {
        return !column.isIdentity() && (data[column.columnName] !== undefined);
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.isJson),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGenerator.prototype, "generateInsertStatement", null);
exports.SimpleSqlInsertGenerator = SimpleSqlInsertGenerator;
//# sourceMappingURL=simple-sql-insert-generator.js.map