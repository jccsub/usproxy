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
class SimpleSqlGenerator {
    constructor(databaseName, tableName, tableSchema) {
        this.tableName = tableName;
        this.tableSchema = tableSchema;
        this.databaseName = databaseName;
    }
    generateInsertStatement(data) {
        let insert = `insert into ${this.tableName} (`;
        let first = true;
        this.tableSchema.forEach((column) => {
            if (first && !this.isIdentity(column)) {
                first = false;
            }
            else {
                insert += ',';
            }
            if (!this.isIdentity(column)) {
                insert += `[${column.columnName}]`;
            }
        });
        first = true;
        insert += `) VALUES (`;
        this.tableSchema.forEach((column) => {
            if (first && !this.isIdentity(column)) {
                first = false;
            }
            else {
                insert += ',';
            }
            if (!this.isIdentity(column)) {
                insert += (column.dataType !== simple_schema_1.SimpleColumnDataType.int) ? `'${data[column.columnName]}'` : `${data[column.columnName]}`;
            }
        });
        insert += `)`;
        return insert;
    }
    generateCreateDatabaseIfItDoesNotExist() {
        let sqlStatement = `if not exists(select * from sys.databases where name = '${this.databaseName}') `;
        sqlStatement += `create database ${this.databaseName}`;
        return sqlStatement;
    }
    generateCreateTableIfItDoesNotExist() {
        var sqlStatement = `if not exists(select * from sysobjects where name='${this.tableName}' and xtype='U') `;
        sqlStatement += `create table ${this.tableName} ( `;
        let first = true;
        this.tableSchema.forEach((column) => {
            let columnDef = '';
            if (first) {
                first = false;
            }
            else {
                columnDef += ', ';
            }
            columnDef = column.getDefinition();
        });
        sqlStatement += `)`;
        return sqlStatement;
    }
    isIdentity(column) {
        return column.attributes && simple_schema_1.SimpleColumnAttributes.identity;
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.isJson),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SimpleSqlGenerator.prototype, "generateInsertStatement", null);
exports.SimpleSqlGenerator = SimpleSqlGenerator;
//# sourceMappingURL=simple-sql-generator.js.map