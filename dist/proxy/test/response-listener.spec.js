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
const proxy_context_1 = require("../proxy-context");
const mocha_typescript_1 = require("mocha-typescript");
const TypeMoq = require("typemoq");
const proxy_test_1 = require("./proxy-test");
const events_1 = require("events");
let ResponseIsReturnedAfterARequest = class ResponseIsReturnedAfterARequest extends proxy_test_1.ProxyTest {
    shouldCallHandleEventWithProxyContent() {
        let context = new proxy_context_1.ProxyContext();
        let request = {};
        request.context = new proxy_context_1.ProxyContext();
        request.message = 'testing';
        let proxyRes = new events_1.EventEmitter();
        let res = {};
        proxyRes.headers = new Array();
        proxyRes.headers.push('header1');
        proxyRes.headers.push('header2');
        proxyRes.statusCode = '123';
        this.mockProxyEventEmitter.emit('proxyRes', proxyRes, request);
        proxyRes.emit('end');
        this.mockResponseListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResponseIsReturnedAfterARequest.prototype, "shouldCallHandleEventWithProxyContent", null);
ResponseIsReturnedAfterARequest = __decorate([
    mocha_typescript_1.suite
], ResponseIsReturnedAfterARequest);
exports.ResponseIsReturnedAfterARequest = ResponseIsReturnedAfterARequest;
//# sourceMappingURL=response-listener.spec.js.map