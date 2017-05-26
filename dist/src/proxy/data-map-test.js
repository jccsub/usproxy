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
let DataMapToString = class DataMapToString {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.dataMap = new data_map_1.DataMap(this.log);
    }
    shouldReturnString() {
        this.dataMap.toString().should.not.be.empty;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataMapToString.prototype, "shouldReturnString", null);
DataMapToString = __decorate([
    mocha_typescript_1.suite
], DataMapToString);
exports.DataMapToString = DataMapToString;
//# sourceMappingURL=data-map-test.js.map