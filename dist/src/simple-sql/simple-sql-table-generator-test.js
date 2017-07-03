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
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("../utils/misc");
const winston_logger_1 = require("../winston-logger");
const simple_schema_1 = require("./simple-schema");
const simple_sql_schema_validator_1 = require("./simple-sql-schema-validator");
const simple_sql_table_generator_1 = require("./simple-sql-table-generator");
const simple_test_schema_builder_1 = require("./simple-test-schema-builder");
const mocha_typescript_1 = require("mocha-typescript");
let SimpleSqlTableGeneratorTest = class SimpleSqlTableGeneratorTest {
    before() {
        this.tableSchema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        this.log = new winston_logger_1.WinstonLog();
        this.validator = new simple_sql_schema_validator_1.SimpleSqlSchemaValidator(this.tableSchema, this.log);
        this.generator = new simple_sql_table_generator_1.SimpleSqlTableGenerator('test', this.tableSchema, this.validator, this.log);
    }
    tableGeneratorDoesGenerateTable() {
        let sql = this.generator.generateCreateTableIfItDoesNotExist();
        let expected = `if not exists(select * from sysobjects where name='test' and xtype='U') ` +
            `create table test ( id int identity(1,1) not null ,name varchar(255) not null ,` +
            `description varchar(1024) not null ,optionalInt int ,max varchar(MAX) not null , ` +
            `bigString varchar(4096) not null ,yesNo char(1) not null ,uuid uniqueidentifier not null  primary key (id))`;
        expected = misc_1.stripWhitespaceAndLower(expected);
        misc_1.stripWhitespaceAndLower(sql).should.equal(expected);
    }
    tableGeneratorCanIncludeCompositePrimaryKey() {
        this.tableSchema.forEach((column) => { if (column.columnName === 'name') {
            column.attributes = simple_schema_1.SimpleColumnAttributes.primaryKey;
        } });
        let sql = this.generator.generateCreateTableIfItDoesNotExist();
        let expected = `if not exists(select * from sysobjects where name='test' and xtype='U') ` +
            `create table test ( id int identity(1,1) not null ,name varchar(255) not null ,` +
            `description varchar(1024) not null ,optionalInt int ,max varchar(MAX) not null , ` +
            `bigString varchar(4096) not null ,yesNo char(1) not null ,uuid uniqueidentifier not null  primary key (id,name))`;
        expected = misc_1.stripWhitespaceAndLower(expected);
        misc_1.stripWhitespaceAndLower(sql).should.equal(expected);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlTableGeneratorTest.prototype, "tableGeneratorDoesGenerateTable", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlTableGeneratorTest.prototype, "tableGeneratorCanIncludeCompositePrimaryKey", null);
SimpleSqlTableGeneratorTest = __decorate([
    mocha_typescript_1.suite
], SimpleSqlTableGeneratorTest);
exports.SimpleSqlTableGeneratorTest = SimpleSqlTableGeneratorTest;
//# sourceMappingURL=simple-sql-table-generator-test.js.map