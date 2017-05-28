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
const http_proxymw_server_1 = require("./http-proxymw-server");
const mock_proxyevent_emitter_1 = require("./mocks/mock-proxyevent-emitter");
const proxy_context_1 = require("./proxy-context");
const chai = require("chai");
const events_1 = require("events");
const mocha_typescript_1 = require("mocha-typescript");
const TypeMoq = require("typemoq");
var should = chai.should();
class HttpProxyMiddlewareServerTest {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.app = TypeMoq.Mock.ofType();
        this.webServer = TypeMoq.Mock.ofType();
        this.replacerFactory = TypeMoq.Mock.ofType();
        this.replacer = TypeMoq.Mock.ofType();
        this.replacerFactory.setup(x => x.create(this.log)).returns(() => { return this.replacer.object; });
        this.proxyEventEmitter = new mock_proxyevent_emitter_1.MockProxyEventEmitter();
        this.underTest = new http_proxymw_server_1.HttpProxyMiddlewareServer(this.proxyEventEmitter, this.webServer.object, this.app.object, this.replacerFactory.object, this.log);
    }
}
let EncountersError = class EncountersError extends HttpProxyMiddlewareServerTest {
    before() {
        super.before();
        this.errorListener = TypeMoq.Mock.ofType();
        this.underTest.addErrorListener(this.errorListener.object);
        this.underTest.listen(1234);
    }
    ifBeforeAProxyRequestHandleEventsAreCalledWithErrorObject() {
        this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'));
        this.errorListener.verify(x => x.handleEvent(TypeMoq.It.isAnyObject(Error)), TypeMoq.Times.once());
    }
    ifAfterAProxyRequestHandleEventsAreCalledWithContextObject() {
        let proxyReq = new events_1.EventEmitter();
        let req = new events_1.EventEmitter();
        let called = false;
        this.errorListener.setup(x => x.handleEvent(TypeMoq.It.isAny())).callback((c) => {
            called = true;
            c.request.body.should.equal('TestData');
        });
        this.proxyEventEmitter.emit('proxyReq', proxyReq, req);
        req.emit('data', 'TestData');
        this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'), req);
        var x = called.should.be.true;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EncountersError.prototype, "ifBeforeAProxyRequestHandleEventsAreCalledWithErrorObject", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EncountersError.prototype, "ifAfterAProxyRequestHandleEventsAreCalledWithContextObject", null);
EncountersError = __decorate([
    mocha_typescript_1.suite('HttpProxyMiddlewareServer encounters an error')
], EncountersError);
let EmitsProxyReqEvent = class EmitsProxyReqEvent extends HttpProxyMiddlewareServerTest {
    before() {
        super.before();
        this.proxyRequestListener = TypeMoq.Mock.ofType();
        this.req = new events_1.EventEmitter();
        this.proxyReq = new events_1.EventEmitter();
        this.req.url = '/url';
        this.req.protocol = 'https';
        this.req.method = 'get';
        this.req.headers = { host: 'host' };
        this.underTest.addRequestListener(this.proxyRequestListener.object);
        var num = null;
        this.underTest.listen(1234);
        this.proxyEventEmitter.emit('proxyReq', this.proxyReq, this.req);
    }
    proxyContextIsCreated() {
        chai.assert.isNotNull(this.req.context);
    }
    proxyContextContainsEmptyBody() {
        var x = this.req.context.request.body.should.be.empty;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmitsProxyReqEvent.prototype, "proxyContextIsCreated", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmitsProxyReqEvent.prototype, "proxyContextContainsEmptyBody", null);
EmitsProxyReqEvent = __decorate([
    mocha_typescript_1.suite('HttpProxyMiddlewareServer emits proxyReq event')
], EmitsProxyReqEvent);
let ProxyReqEmitsDataEvent = class ProxyReqEmitsDataEvent extends EmitsProxyReqEvent {
    before() {
        super.before();
        this.data = 'TestData';
        this.req.emit('data', this.data);
    }
    proxyContextContainsInitialData() {
        this.req.context.request.body.should.equal(this.data);
    }
    proxyContextContainsAppendedData() {
        this.req.emit('data', this.data);
        this.req.context.request.body.should.equal(`${this.data}${this.data}`);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsDataEvent.prototype, "proxyContextContainsInitialData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsDataEvent.prototype, "proxyContextContainsAppendedData", null);
ProxyReqEmitsDataEvent = __decorate([
    mocha_typescript_1.suite("HttpProxyMiddlewareServer's proxyReq emits a data event")
], ProxyReqEmitsDataEvent);
let ProxyReqEmitsEndEvent = class ProxyReqEmitsEndEvent extends EmitsProxyReqEvent {
    before() {
        super.before();
        this.data = 'testdata';
        this.req.url = '/url';
        this.req.protocol = 'https';
        this.req.method = 'get';
        this.req.headers = { host: 'host' };
    }
    proxyContextContainsNoData() {
        this.req.emit('end');
        var x = this.req.context.request.body.should.be.empty;
    }
    proxyContextContainsUrl() {
        this.req.emit('end');
        this.req.context.request.url.should.equal(this.req.url);
    }
    proxyContextContainsHost() {
        this.req.emit('end');
        this.req.context.request.host.should.equal(this.req.headers.host);
    }
    proxyContextContainsHttpProtocol() {
        this.req.emit('end');
        this.req.context.request.protocol.should.equal('http');
    }
    proxyContextContainsMethod() {
        this.req.emit('end');
        this.req.context.request.method.should.equal(this.req.method);
    }
    proxyContextDoesNotContainBody() {
        this.req.emit('end');
        var x = this.req.context.request.body.should.be.empty;
    }
    proxyContextContainsFullUrl() {
        this.req.emit('end');
        let context = this.req.context;
        let expectedUrl = `${context.request.protocol}://${context.request.host}${context.request.url}`;
        context.request.fullUrl.should.equal(expectedUrl);
    }
    proxyContextContainsData() {
        this.req.emit('data', this.data);
        this.req.emit('end');
        this.req.context.request.body.should.equal(this.data);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsNoData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsUrl", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsHost", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsHttpProtocol", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsMethod", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextDoesNotContainBody", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsFullUrl", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEmitsEndEvent.prototype, "proxyContextContainsData", null);
ProxyReqEmitsEndEvent = __decorate([
    mocha_typescript_1.suite("HttpProxyMiddlewareServer's proxyReq emits an end event")
], ProxyReqEmitsEndEvent);
let EmitsProxyResEvent = class EmitsProxyResEvent extends HttpProxyMiddlewareServerTest {
    before() {
        super.before();
        this.proxyResponseListener = TypeMoq.Mock.ofType();
        this.req = new events_1.EventEmitter();
        this.req.context = new proxy_context_1.ProxyContext(this.log);
        this.res = new events_1.EventEmitter();
        this.data = 'TestData';
        this.headerText = 'Header1';
        this.statusCodeText = '202';
        this.proxyRes = new events_1.EventEmitter();
        this.proxyRes.headers = new Array();
        this.proxyRes.headers.push(this.headerText);
        this.proxyRes.statusCode = this.statusCodeText;
        this.underTest.addResponseListener(this.proxyResponseListener.object);
        this.underTest.listen(1234);
        this.proxyEventEmitter.emit('proxyRes', this.proxyRes, this.req, this.res);
    }
    noErrorOccurrs() {
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmitsProxyResEvent.prototype, "noErrorOccurrs", null);
EmitsProxyResEvent = __decorate([
    mocha_typescript_1.suite('HttpProxyMiddlewareServer emits proxyRes event')
], EmitsProxyResEvent);
let ProxyResEmitsDataEvent = class ProxyResEmitsDataEvent extends EmitsProxyResEvent {
    before() {
        super.before();
        this.proxyResponseListener = TypeMoq.Mock.ofType();
        this.underTest.addResponseListener(this.proxyResponseListener.object);
        this.proxyRes.emit('data', this.data);
    }
    dataIsInTheProxyContext() {
        this.req.context.response.body.should.equal(this.data);
    }
    handleEventIsNotCalled() {
        this.proxyResponseListener.verify(x => x.handleEvent(TypeMoq.It.isAny()), TypeMoq.Times.never());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsDataEvent.prototype, "dataIsInTheProxyContext", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsDataEvent.prototype, "handleEventIsNotCalled", null);
ProxyResEmitsDataEvent = __decorate([
    mocha_typescript_1.suite("HttpProxyMiddleware's proxyRes emits data event")
], ProxyResEmitsDataEvent);
let ProxyResEmitsEndEvent = class ProxyResEmitsEndEvent extends EmitsProxyResEvent {
    before() {
        super.before();
        this.proxyResponseListener = TypeMoq.Mock.ofType();
        this.underTest.addResponseListener(this.proxyResponseListener.object);
    }
    handleEventIsCalled() {
        this.proxyRes.emit('data', this.data);
        this.proxyRes.emit('end');
        this.proxyResponseListener.verify(x => x.handleEvent(TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
    proxyContextContainsHeaders() {
        this.proxyRes.emit('end');
        this.req.context.response.headers.length.should.equal(1);
        this.req.context.response.headers[0].should.equal(this.headerText);
    }
    proxyContextContainsStatusCode() {
        this.proxyRes.emit('end');
        this.req.context.response.statusCode.should.equal(this.statusCodeText);
    }
    proxyContextContainsAppendedResponseData() {
        this.proxyRes.emit('data', this.data);
        this.proxyRes.emit('data', this.data);
        this.proxyRes.emit('end');
        this.req.context.response.body.should.equal(`${this.data}${this.data}`);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsEndEvent.prototype, "handleEventIsCalled", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsEndEvent.prototype, "proxyContextContainsHeaders", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsEndEvent.prototype, "proxyContextContainsStatusCode", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResEmitsEndEvent.prototype, "proxyContextContainsAppendedResponseData", null);
ProxyResEmitsEndEvent = __decorate([
    mocha_typescript_1.suite("HttpProxyMiddleware's proxyRes emits end event")
], ProxyResEmitsEndEvent);
//# sourceMappingURL=http-proxymw-server-test.js.map