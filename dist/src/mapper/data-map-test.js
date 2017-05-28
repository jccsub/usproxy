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
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const data_map_1 = require("./data-map");
let DataMapTests = class DataMapTests {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.dataMap = new data_map_1.DataMap(this.log);
    }
    thisShouldStopCompilingWithFutureReleaseOfTypescript() {
        //datamap.content shouldbe readonly, but that doesn't work
        this.dataMap.content['test'] = 'x';
    }
    addContentShouldThrowErrorWhenContentIsNull() {
        let errorDetected = false;
        try {
            this.dataMap.addContent(null);
        }
        catch (e) {
            errorDetected = true;
        }
        errorDetected.should.equal(true);
    }
    addContentShouldThrowErrorWhenContentIsNotJson() {
        let errorDetected = false;
        try {
            this.dataMap.addContent('1');
        }
        catch (e) {
            errorDetected = true;
        }
        errorDetected.should.equal(true);
    }
    addContentAcceptsJsonString() {
        this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');
    }
    addContentAcceptsObject() {
        let obj = { prop1: "val1", prop2: "val2" };
        this.dataMap.addContent(obj);
    }
    addedContentIsAccessible() {
        this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');
    }
    toStringReturnsStringRepresentationOfContent() {
        this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');
        var x = this.dataMap.toString().should.not.be.empty;
        console.log(this.dataMap.toString());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "thisShouldStopCompilingWithFutureReleaseOfTypescript", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "addContentShouldThrowErrorWhenContentIsNull", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "addContentShouldThrowErrorWhenContentIsNotJson", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "addContentAcceptsJsonString", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "addContentAcceptsObject", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "addedContentIsAccessible", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapTests.prototype, "toStringReturnsStringRepresentationOfContent", null);
DataMapTests = __decorate([
    mocha_typescript_1.suite
], DataMapTests);
exports.DataMapTests = DataMapTests;
//# sourceMappingURL=data-map-test.js.map