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
const proxy_context_1 = require("../proxy/proxy-context");
const data_mapper_1 = require("./data-mapper");
const winston_logger_1 = require("../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const TypeMoq = require("typemoq");
const chai_1 = require("chai");
let DataMapperTests = class DataMapperTests {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.parser = TypeMoq.Mock.ofType();
        this.dataMap = new data_mapper_1.DataMapper(this.parser.object, this.log);
    }
    undefinedContextTriggersException() {
        chai_1.expect(() => { this.dataMap.handleEvent(this.context); }).to.throw();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapperTests.prototype, "undefinedContextTriggersException", null);
DataMapperTests = __decorate([
    mocha_typescript_1.suite
], DataMapperTests);
exports.DataMapperTests = DataMapperTests;
let DataMapperTestWithContext = class DataMapperTestWithContext extends DataMapperTests {
    before() {
        super.before();
        this.context = new proxy_context_1.ProxyContext(this.log);
    }
    requestBodyWithDataIsAddedToDataMap() {
        let body = '{"test" : "data"}';
        this.context.request.body = body;
        this.parser.setup(x => x.parse(TypeMoq.It.isValue(body))).returns((b) => { return JSON.parse(body); });
        this.dataMap.handleEvent(this.context);
        this.context.dataMap.content.test.should.equal('data');
    }
    noErrorOccursIfBodyIsEmpty() {
        let body = '';
        this.context.request.body = body;
        this.dataMap.handleEvent(this.context);
        this.context.dataMap.content.size.should.equal(0);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapperTestWithContext.prototype, "requestBodyWithDataIsAddedToDataMap", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapperTestWithContext.prototype, "noErrorOccursIfBodyIsEmpty", null);
DataMapperTestWithContext = __decorate([
    mocha_typescript_1.suite
], DataMapperTestWithContext);
//# sourceMappingURL=data-mapper-test.js.map