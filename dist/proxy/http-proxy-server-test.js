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
const TypeMoq = require("typemoq");
const chai_1 = require("chai");
const http_proxy_server_1 = require("./http-proxy-server");
const proxy_context_1 = require("./proxy-context");
const mock_proxyevent_emitter_1 = require("./mocks/mock-proxyevent-emitter");
const winston_logger_1 = require("./../winston-logger");
const events_1 = require("events");
class ProxyTest {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.mockWebServer = TypeMoq.Mock.ofType();
        this.mockStreamingHtml = TypeMoq.Mock.ofType();
        this.mockProxyEventEmitter = new mock_proxyevent_emitter_1.MockProxyEventEmitter();
        this.mockStreamingHtml.setup(x => x.selectAndReplaceItems).returns(() => {
            return new Array();
        });
        this.mockStreamingHtml.setup(x => x.selectAndReplaceCallback).returns(() => {
            return (req, res, next) => { };
        });
        this.mockWebServer.setup(x => x.listen(TypeMoq.It.isAny()));
        this.mockWebServer.setup(x => x.use(TypeMoq.It.isAny()));
        this.proxyServer = new http_proxy_server_1.HttpProxyServer(this.mockProxyEventEmitter, this.mockWebServer.object, this.mockStreamingHtml.object, this.log);
        this.mockErrorListener = TypeMoq.Mock.ofType();
        this.mockResponseListener = TypeMoq.Mock.ofType();
        this.proxyServer.addErrorListener(this.mockErrorListener.object);
        this.proxyServer.addResponseListener(this.mockResponseListener.object);
        this.proxyServer.listen(1234);
        chai_1.should();
    }
}
exports.ProxyTest = ProxyTest;
let ErrorEmittedBeforeARequestIsMade = class ErrorEmittedBeforeARequestIsMade extends ProxyTest {
    shouldCallHandleEventOnce() {
        let e = new Error('Again');
        this.mockProxyEventEmitter.emit('error', e);
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
    shouldCallHandleEventWithTheEmittedErrorObject() {
        let e = new Error('Again');
        this.mockProxyEventEmitter.emit('error', new Error('Just testing'));
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(Error)), TypeMoq.Times.once());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorEmittedBeforeARequestIsMade.prototype, "shouldCallHandleEventOnce", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorEmittedBeforeARequestIsMade.prototype, "shouldCallHandleEventWithTheEmittedErrorObject", null);
ErrorEmittedBeforeARequestIsMade = __decorate([
    mocha_typescript_1.suite
], ErrorEmittedBeforeARequestIsMade);
let ErrorEmittedAfterARequestIsMade = class ErrorEmittedAfterARequestIsMade extends ProxyTest {
    shouldCallHandleEventOnce() {
        let e = new Error('Again');
        this.mockProxyEventEmitter.emit('proxyReq');
        this.mockProxyEventEmitter.emit('error', e);
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
    shouldCallHandleEventWithProxyContext() {
        let context = new proxy_context_1.ProxyContext();
        let request = {};
        request.context = new proxy_context_1.ProxyContext();
        this.mockProxyEventEmitter.emit('error', new Error('Error Message'), request);
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(proxy_context_1.ProxyContext)), TypeMoq.Times.once());
    }
    shouldCallHandleEventWithProxyContextContainingError() {
        let context = new proxy_context_1.ProxyContext();
        let request = {};
        this.mockErrorListener.setup(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(proxy_context_1.ProxyContext))).callback((l, c) => {
            c.error.message.should.equal('Error Message');
        });
        request.context = new proxy_context_1.ProxyContext();
        this.mockProxyEventEmitter.emit('error', new Error('Error Message'), request);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorEmittedAfterARequestIsMade.prototype, "shouldCallHandleEventOnce", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorEmittedAfterARequestIsMade.prototype, "shouldCallHandleEventWithProxyContext", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErrorEmittedAfterARequestIsMade.prototype, "shouldCallHandleEventWithProxyContextContainingError", null);
ErrorEmittedAfterARequestIsMade = __decorate([
    mocha_typescript_1.suite
], ErrorEmittedAfterARequestIsMade);
let ResponseIsReturnedAfterARequest = class ResponseIsReturnedAfterARequest extends ProxyTest {
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
//# sourceMappingURL=http-proxy-server-test.js.map