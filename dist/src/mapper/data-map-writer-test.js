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
const data_map_1 = require("./data-map");
const data_map_writer_1 = require("./data-map-writer");
const mocha_typescript_1 = require("mocha-typescript");
const TypeMoq = require("typemoq");
let DataMapWriterTests = class DataMapWriterTests {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.dataMap = new data_map_1.DataMap(this.log);
        this.dataWriter = TypeMoq.Mock.ofType();
        this.underTest = new data_map_writer_1.DataMapWriter(this.dataWriter.object, this.log);
    }
    writeCallsDataWriter() {
        this.underTest.write(this.dataMap);
        this.dataWriter.verify(x => x.write(TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapWriterTests.prototype, "writeCallsDataWriter", null);
DataMapWriterTests = __decorate([
    mocha_typescript_1.suite
], DataMapWriterTests);
//# sourceMappingURL=data-map-writer-test.js.map