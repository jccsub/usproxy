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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TypeMoq = require("typemoq");
const mocha_typescript_1 = require("mocha-typescript");
const sql_data_writer_1 = require("./sql-data-writer");
const winston_logger_1 = require("../winston-logger");
const simple_test_schema_builder_1 = require("../simple-sql/simple-test-schema-builder");
let SqlDataWriterTest = class SqlDataWriterTest {
    before() {
        this.mockConnection = TypeMoq.Mock.ofType();
        this.schema = simple_test_schema_builder_1.SimpleTestSchemaBuilder.buildSchema();
        this.schemaValidator = TypeMoq.Mock.ofType();
        this.mockSqlGenerator = TypeMoq.Mock.ofType();
        this.dataWriter = new sql_data_writer_1.SqlDataWriter(this.mockConnection.object, this.mockSqlGenerator.object, this.schemaValidator.object);
        this.mockConnection.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => __awaiter(this, void 0, void 0, function* () {
            let rowsAffected = new Array();
            rowsAffected.push(1);
            return {
                rowsAffected: rowsAffected
            };
        }));
        this.log = new winston_logger_1.WinstonLog();
    }
    writeFailsIfDataToWriteIsNotJson() {
        return __awaiter(this, void 0, void 0, function* () {
            let errorOccured = false;
            try {
                yield this.dataWriter.write('test');
            }
            catch (err) {
                errorOccured = true;
            }
            if (!errorOccured) {
                throw new Error('expected error');
            }
        });
    }
    writeValidatesTheSchemaOfTheData() {
        return __awaiter(this, void 0, void 0, function* () {
            let goodData = this.createGoodData();
            yield this.dataWriter.write(goodData).then(() => {
                let errorOccured = null;
                try {
                    this.schemaValidator.verify(x => x.validate(TypeMoq.It.isAny()), TypeMoq.Times.once());
                }
                catch (err) {
                    errorOccured = err;
                }
                return new Promise((resolve, reject) => {
                    if (errorOccured) {
                        reject(errorOccured);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    createGoodData() {
        return {
            name: 'name1',
            description: 'description'
        };
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SqlDataWriterTest.prototype, "writeFailsIfDataToWriteIsNotJson", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SqlDataWriterTest.prototype, "writeValidatesTheSchemaOfTheData", null);
SqlDataWriterTest = __decorate([
    mocha_typescript_1.suite
], SqlDataWriterTest);
//# sourceMappingURL=sql-data-writer-test.js.map