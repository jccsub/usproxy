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
const httpproxy_proxy_server_1 = require("../httpproxy-proxy-server");
const chai_1 = require("chai");
const proxy_context_1 = require("../proxy-context");
const mocha_typescript_1 = require("mocha-typescript");
const TypeMoq = require("typemoq");
const mock_proxyevent_emitter_1 = require("./mock-proxyevent-emitter");
const winston_logger_1 = require("../../winston-logger");
class ErrorHandlingTest {
    before() {
        this.mockWebServer = TypeMoq.Mock.ofType();
        this.mockProxyEventEmitter = new mock_proxyevent_emitter_1.MockProxyEventEmitter();
        this.log = new winston_logger_1.WinstonLog();
        this.proxyServer = new httpproxy_proxy_server_1.HttpProxyProxyServer(this.mockProxyEventEmitter, this.mockWebServer.object, this.log);
        this.mockErrorListener = TypeMoq.Mock.ofType();
        this.proxyServer.addErrorListener(this.mockErrorListener.object);
        this.proxyServer.listen(1234);
        chai_1.should();
    }
}
let ErrorEmittedBeforeARequestIsMade = class ErrorEmittedBeforeARequestIsMade extends ErrorHandlingTest {
    //@test
    shouldCallHandleEventOnce() {
        let e = new Error('Again');
        this.mockProxyEventEmitter.emit('error', e);
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
    //@test
    shouldCallHandleEventWithTheEmittedErrorObject() {
        let e = new Error('Again');
        this.mockProxyEventEmitter.emit('error', new Error('Just testing'));
        this.mockErrorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(Error)), TypeMoq.Times.once());
    }
};
ErrorEmittedBeforeARequestIsMade = __decorate([
    mocha_typescript_1.suite
], ErrorEmittedBeforeARequestIsMade);
let ErrorEmittedAfterARequestIsMade = class ErrorEmittedAfterARequestIsMade extends ErrorHandlingTest {
    //@test
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
//# sourceMappingURL=errorhandling-test.js.map