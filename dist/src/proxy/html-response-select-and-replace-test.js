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
const response_select_and_replace_1 = require("./response-select-and-replace");
const html_response_select_and_replace_1 = require("./html-response-select-and-replace");
const winston_logger_1 = require("../winston-logger");
const chai_1 = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
let HtmlResponseSelectAndReplaceTest = class HtmlResponseSelectAndReplaceTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.underTest = new html_response_select_and_replace_1.HtmlResponseSelectAndReplace(this.replacerFactory(), this.log);
        this.executeRequest = {};
        this.executeResponse = {};
    }
    objectCreated() { }
    replacerFactory() {
        return (reqSelects, resSelects) => {
            this.requestSelects = reqSelects;
            this.responseSelects = resSelects;
            return (req, res, func) => {
                this.currentReq = req;
                this.currentRes = res;
                this.currentFunc = func;
            };
        };
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceTest.prototype, "objectCreated", null);
HtmlResponseSelectAndReplaceTest = __decorate([
    mocha_typescript_1.suite
], HtmlResponseSelectAndReplaceTest);
let HtmlResponseSelectAndReplaceExecuteTest = class HtmlResponseSelectAndReplaceExecuteTest extends HtmlResponseSelectAndReplaceTest {
    throwsExceptionIfReqIsNull() {
        let exceptionThrown = false;
        try {
            this.underTest.execute(null, {});
        }
        catch (e) {
            exceptionThrown = true;
        }
        exceptionThrown.should.equal(true);
    }
    throwsExceptionIfResIsNull() {
        let exceptionThrown = false;
        try {
            this.underTest.execute({}, null);
        }
        catch (e) {
            exceptionThrown = true;
        }
        exceptionThrown.should.equal(true);
    }
    replacerFactoryIsCalledWithNoRequestModifications() {
        this.underTest.execute(this.executeRequest, this.executeResponse);
        var x = this.requestSelects.should.be.empty;
    }
    replacerIsCalledWithExpectedRequest() {
        this.executeRequest.text = 'test';
        this.underTest.execute(this.executeRequest, this.executeResponse);
        this.currentReq.text.should.equal('test');
    }
    replacerIsCalledWithExpectedResponse() {
        this.executeResponse.text = 'test';
        this.underTest.execute(this.executeRequest, this.executeResponse);
        this.currentRes.text.should.equal('test');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceExecuteTest.prototype, "throwsExceptionIfReqIsNull", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceExecuteTest.prototype, "throwsExceptionIfResIsNull", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceExecuteTest.prototype, "replacerFactoryIsCalledWithNoRequestModifications", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceExecuteTest.prototype, "replacerIsCalledWithExpectedRequest", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceExecuteTest.prototype, "replacerIsCalledWithExpectedResponse", null);
HtmlResponseSelectAndReplaceExecuteTest = __decorate([
    mocha_typescript_1.suite
], HtmlResponseSelectAndReplaceExecuteTest);
let HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest = class HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest extends HtmlResponseSelectAndReplaceTest {
    emptySelectAndReplaceArrayDoesNotThrowException() {
        this.underTest.addSelectAndReplaceItems([]);
    }
    appendSelectAndReplaceItemIsProcessedWhenExecuteIsCalled() {
        let appendItem = new response_select_and_replace_1.SelectAndReplaceItem('.b', '<h1>test</h1>', response_select_and_replace_1.SelectAndReplaceType.Append);
        this.underTest.addSelectAndReplaceItems([appendItem]);
        this.underTest.execute(this.executeRequest, this.executeResponse);
        this.responseSelects[0].query.should.equal('.b');
    }
    replaceSelectAndReplaceItemIsProcessedWhenExecuteIsCalled() {
        let replaceItem = new response_select_and_replace_1.SelectAndReplaceItem('.b', '<h1>test</h1>', response_select_and_replace_1.SelectAndReplaceType.Replace);
        this.underTest.addSelectAndReplaceItems([replaceItem]);
        this.underTest.execute(this.executeRequest, this.executeResponse);
        this.responseSelects[0].query.should.equal('.b');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest.prototype, "emptySelectAndReplaceArrayDoesNotThrowException", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest.prototype, "appendSelectAndReplaceItemIsProcessedWhenExecuteIsCalled", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest.prototype, "replaceSelectAndReplaceItemIsProcessedWhenExecuteIsCalled", null);
HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest = __decorate([
    mocha_typescript_1.suite
], HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest);
//# sourceMappingURL=html-response-select-and-replace-test.js.map