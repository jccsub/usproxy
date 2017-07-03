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
const winston_logger_1 = require("../winston-logger");
const simple_schema_1 = require("./simple-schema");
const simple_sql_data_validator_1 = require("./simple-sql-data-validator");
const simple_test_schema_builder_1 = require("./simple-test-schema-builder");
const mocha_typescript_1 = require("mocha-typescript");
const misc_1 = require("../utils/misc");
let SimpleSqlSchemaValidatorTest = class SimpleSqlSchemaValidatorTest {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.simpleSchemaValidator = new simple_sql_data_validator_1.SimpleSqlDataValidator(simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema(), this.log);
        this.testData = simple_test_schema_builder_1.SimpleTestSchemaBuilder.generateData('col1', 'this is col1', 'Y', 'whole lot of text', 10);
    }
    goodSchemaValidatesSuccessfully() {
        this.simpleSchemaValidator.validate(this.testData);
    }
    valueProvidedForIdentityColumnThrowsException() {
        this.testData.id = 1;
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    nonOptionalValueMustExist() {
        delete this.testData.name;
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    anIntColumnMustContainAnIntegerValue() {
        this.testData.optionalInt = 7.2;
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    stringTypeCannotBeNullIfNotOptional() {
        this.testData.description = null;
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    stringCannotExceedSpecifiedCharacters() {
        this.testData.name = Array(258).join('x'); //name is a string255    
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    noProblemInAssigningNonStringToStringField() {
        this.testData.name = 12345;
        this.simpleSchemaValidator.validate(this.testData);
    }
    invalidUuidIsCaught() {
        this.testData.uuid = '12345-12345-1';
        misc_1.expectException(() => { this.simpleSchemaValidator.validate(this.testData); });
    }
    unexpectedDataTypeIsCaught() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let col = new simple_schema_1.SimpleColumn('test', 500);
        schema.push(col);
        this.testData.test = 'not valid since dataType is not valid';
        this.simpleSchemaValidator = new simple_sql_data_validator_1.SimpleSqlDataValidator(schema, this.log);
        misc_1.expectException(() => this.simpleSchemaValidator.validate(this.testData));
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "goodSchemaValidatesSuccessfully", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "valueProvidedForIdentityColumnThrowsException", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "nonOptionalValueMustExist", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "anIntColumnMustContainAnIntegerValue", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "stringTypeCannotBeNullIfNotOptional", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "stringCannotExceedSpecifiedCharacters", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "noProblemInAssigningNonStringToStringField", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "invalidUuidIsCaught", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidatorTest.prototype, "unexpectedDataTypeIsCaught", null);
SimpleSqlSchemaValidatorTest = __decorate([
    mocha_typescript_1.suite
], SimpleSqlSchemaValidatorTest);
//# sourceMappingURL=simple-sql-schema-validator-test.js.map