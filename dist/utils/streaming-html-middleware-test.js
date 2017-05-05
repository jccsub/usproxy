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
const mocha_typescript_1 = require("mocha-typescript");
const streaming_html_middleware_1 = require("./streaming-html-middleware");
const winston_logger_1 = require("../winston-logger");
let CreatedSelectAndReplaceItem = class CreatedSelectAndReplaceItem {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.selectAndReplaceItem = new streaming_html_middleware_1.SelectAndReplaceItem('selector', 'replacement');
    }
    containsASelector() {
        this.selectAndReplaceItem.cssSelector.should.equal('selector');
    }
    containsAReplacement() {
        this.selectAndReplaceItem.replacementHtml.should.equal('replacement');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedSelectAndReplaceItem.prototype, "containsASelector", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedSelectAndReplaceItem.prototype, "containsAReplacement", null);
CreatedSelectAndReplaceItem = __decorate([
    mocha_typescript_1.suite
], CreatedSelectAndReplaceItem);
//# sourceMappingURL=streaming-html-middleware-test.js.map