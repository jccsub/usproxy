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
const request_parser_1 = require("./request-parser");
const chai_1 = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
let RequestParserTest = class RequestParserTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.requestParser = new request_parser_1.RequestParser(this.log);
    }
    requestParserIsCreated() {
    }
    parsingEmptyStringDoesNotThrowException() {
        this.requestParser.parse('');
    }
    queryStringWithOneParameterIsParsed() {
        let queryString = '?param1=val1';
        let result = this.requestParser.parse(queryString);
        result.param1.should.equal('val1');
    }
    queryStringWithMultipleParametersIsParsed() {
        let queryString = '?param1=val1&param2=val2';
        let result = this.requestParser.parse(queryString);
        result.param1.should.equal('val1');
        result.param2.should.equal('val2');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestParserTest.prototype, "requestParserIsCreated", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestParserTest.prototype, "parsingEmptyStringDoesNotThrowException", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestParserTest.prototype, "queryStringWithOneParameterIsParsed", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestParserTest.prototype, "queryStringWithMultipleParametersIsParsed", null);
RequestParserTest = __decorate([
    mocha_typescript_1.suite
], RequestParserTest);
//# sourceMappingURL=request-parser-test.js.map