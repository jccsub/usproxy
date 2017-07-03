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
const misc_1 = require("../utils/misc");
const simple_schema_1 = require("./simple-schema");
const simple_test_schema_builder_1 = require("./simple-test-schema-builder");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let SimpleColumnTest = class SimpleColumnTest {
    before() {
        this.log = new winston_logger_1.WinstonLog();
    }
    columnCannotBeOptionalAndPrimaryKey() {
        misc_1.expectException(() => { let column = new simple_schema_1.SimpleColumn('test', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.optional | simple_schema_1.SimpleColumnAttributes.primaryKey); });
    }
    columnCannotBeOptionalAndIdentity() {
        misc_1.expectException(() => { let column = new simple_schema_1.SimpleColumn('test', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.optional | simple_schema_1.SimpleColumnAttributes.identity); });
    }
    isIdentityReturnsTrueForIdentityColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'id');
        var x = chai_1.expect(definition.isIdentity()).to.be.true;
    }
    isIdentityReturnsFalseForNonIdentityColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'name');
        var x = chai_1.expect(definition.isIdentity()).to.be.false;
    }
    isPrimaryKeyReturnsFalseForNonPrimaryKeyColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'name');
        var x = chai_1.expect(definition.isPrimaryKey()).to.be.false;
    }
    isPrimaryKeyReturnsTrueForPrimaryKeyColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'id');
        var x = chai_1.expect(definition.isPrimaryKey()).to.be.true;
    }
    isOptionalReturnsTrueForOptionalColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'optionalInt');
        var x = chai_1.expect(definition.isOptional()).to.be.true;
    }
    isOptionalReturnsFalseForNonOptionalColumn() {
        let schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        let definition = this.findColumnByName(schema, 'name');
        var x = chai_1.expect(definition.isOptional()).to.be.false;
    }
    findColumnByName(schemaToSearch, columnName) {
        let foundColumn = new simple_schema_1.SimpleColumn('notfound', simple_schema_1.SimpleColumnDataType.int);
        schemaToSearch.forEach((column) => {
            if (column.columnName === columnName) {
                foundColumn = column;
                return;
            }
        });
        return foundColumn;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "columnCannotBeOptionalAndPrimaryKey", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "columnCannotBeOptionalAndIdentity", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isIdentityReturnsTrueForIdentityColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isIdentityReturnsFalseForNonIdentityColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isPrimaryKeyReturnsFalseForNonPrimaryKeyColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isPrimaryKeyReturnsTrueForPrimaryKeyColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isOptionalReturnsTrueForOptionalColumn", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleColumnTest.prototype, "isOptionalReturnsFalseForNonOptionalColumn", null);
SimpleColumnTest = __decorate([
    mocha_typescript_1.suite
], SimpleColumnTest);
//# sourceMappingURL=simple-schema-test.js.map