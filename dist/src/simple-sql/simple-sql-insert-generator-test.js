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
const simple_sql_data_validator_1 = require("./simple-sql-data-validator");
const simple_sql_insert_generator_1 = require("./simple-sql-insert-generator");
const simple_test_schema_builder_1 = require("./simple-test-schema-builder");
const mocha_typescript_1 = require("mocha-typescript");
let SimpleSqlInsertGeneratorTest = class SimpleSqlInsertGeneratorTest {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.tableSchema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        this.validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(this.tableSchema, this.log);
        this.generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', this.tableSchema, this.validator, this.log);
    }
    generateInsertStatementAcceptsOnlyJsonData() {
        misc_1.expectException(() => this.generator.generateInsertStatement("test"));
    }
    generateInsertStatementDoesGenerateInsert() {
        let data = simple_test_schema_builder_1.SimpleTestSchemaBuilder.generateData('name', 'description', 'Y', 'Hello', 5);
        let insertStatement = this.generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([name],[description],[optionalint],[max],[bigstring],[yesno],[uuid])values('name','description',5,'hello','defaulttext','y','${data.uuid}')`);
    }
    generateInsertStatementValidatesRequiredData() {
        let data = simple_test_schema_builder_1.SimpleTestSchemaBuilder.generateData('name', 'description', 'Y', 'Hello', 5);
        delete data.name;
        misc_1.expectException(() => { let insertStatement = this.generator.generateInsertStatement(data); });
    }
    generateColumnDefinitionGeneratesNonIdentityPrimaryKey() {
        let column1 = new simple_schema_1.SimpleColumn('pk', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.primaryKey);
        let schema = [column1];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { pk: 1 };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal('insertinto[test]([pk])values(1)');
    }
    generateColumnDefinitionGeneratesIdentityPrimaryKey() {
        let column1 = new simple_schema_1.SimpleColumn('pk', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.primaryKey | simple_schema_1.SimpleColumnAttributes.identity);
        let column2 = new simple_schema_1.SimpleColumn('name', simple_schema_1.SimpleColumnDataType.string1024);
        let schema = [column1, column2];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { name: 'my name' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([name])values('myname')`);
    }
    generateColumnDefinitionByDefaultGeneratesNonNullColumn() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.string255);
        let schema = [column1];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col1: null };
        misc_1.expectException(() => { let insertStatement = generator.generateInsertStatement(data); });
    }
    generateColumnDefinitionGeneratesStringTypePrimaryKey() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.string255, simple_schema_1.SimpleColumnAttributes.primaryKey);
        let schema = [column1];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col1: 'hello' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1])values('hello')`);
    }
    generateColumnDefinitionGeneratesOptionalButPresentCharStringColumn() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.char, simple_schema_1.SimpleColumnAttributes.optional);
        let column2 = new simple_schema_1.SimpleColumn('col2', simple_schema_1.SimpleColumnDataType.string1024);
        let schema = [column1, column2];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col1: 'Y', col2: 'name' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1],[col2])values('y','name')`);
    }
    generateColumnDefinitionGeneratesOptionalAndNotPresentCharStringColumn() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.char, simple_schema_1.SimpleColumnAttributes.optional);
        let column2 = new simple_schema_1.SimpleColumn('col2', simple_schema_1.SimpleColumnDataType.string1024);
        let schema = [column1, column2];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col2: 'name' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col2])values('name')`);
    }
    generateColumnDefinitionGeneratesUuidIdentityColumn() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.uniqueidentifier, simple_schema_1.SimpleColumnAttributes.identity);
        let column2 = new simple_schema_1.SimpleColumn('col2', simple_schema_1.SimpleColumnDataType.string1024);
        let schema = [column1, column2];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col2: 'name' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col2])values('name')`);
    }
    generateColumnDefinitionGeneratesUuidColumn() {
        let column1 = new simple_schema_1.SimpleColumn('col1', simple_schema_1.SimpleColumnDataType.uniqueidentifier);
        let column2 = new simple_schema_1.SimpleColumn('col2', simple_schema_1.SimpleColumnDataType.string1024);
        let schema = [column1, column2];
        let validator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        let generator = new simple_sql_insert_generator_1.SimpleSqlInsertGenerator('test', schema, validator, this.log);
        let data = { col1: '0880c11f-3c9a-4358-ad6e-47ce425c2f02', col2: 'name' };
        let insertStatement = generator.generateInsertStatement(data);
        misc_1.stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1],[col2])values('0880c11f-3c9a-4358-ad6e-47ce425c2f02','name')`);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateInsertStatementAcceptsOnlyJsonData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateInsertStatementDoesGenerateInsert", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateInsertStatementValidatesRequiredData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesNonIdentityPrimaryKey", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesIdentityPrimaryKey", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionByDefaultGeneratesNonNullColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesStringTypePrimaryKey", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesOptionalButPresentCharStringColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesOptionalAndNotPresentCharStringColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesUuidIdentityColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlInsertGeneratorTest.prototype, "generateColumnDefinitionGeneratesUuidColumn", null);
SimpleSqlInsertGeneratorTest = __decorate([
    mocha_typescript_1.suite
], SimpleSqlInsertGeneratorTest);
exports.SimpleSqlInsertGeneratorTest = SimpleSqlInsertGeneratorTest;
//# sourceMappingURL=simple-sql-insert-generator-test.js.map