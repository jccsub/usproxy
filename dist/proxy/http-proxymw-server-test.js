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
const proxy_context_1 = require("./proxy-context");
const events_1 = require("events");
const mock_proxyevent_emitter_1 = require("./mocks/mock-proxyevent-emitter");
const http_proxymw_server_1 = require("./http-proxymw-server");
const winston_logger_1 = require("../winston-logger");
const TypeMoq = require("typemoq");
const chai = require("chai");
const mocha_typescript_1 = require("mocha-typescript");
var should = chai.should();
class CreatedHttpProxyMiddlewareServer {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.app = TypeMoq.Mock.ofType();
        this.webServer = TypeMoq.Mock.ofType();
        this.proxyEventEmitter = new mock_proxyevent_emitter_1.MockProxyEventEmitter();
        this.underTest = new http_proxymw_server_1.HttpProxyMiddlewareServer(this.proxyEventEmitter, this.webServer.object, this.app.object, this.log);
    }
}
let HttpProxyMiddlewareServer_EncountersError = class HttpProxyMiddlewareServer_EncountersError extends CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.errorListener = TypeMoq.Mock.ofType();
        this.underTest.addErrorListener(this.errorListener.object);
        this.underTest.listen(1234);
        this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'));
    }
    handleEventsShouldBeCalled() {
        this.errorListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HttpProxyMiddlewareServer_EncountersError.prototype, "handleEventsShouldBeCalled", null);
HttpProxyMiddlewareServer_EncountersError = __decorate([
    mocha_typescript_1.suite('HttpProxyMiddlewareServer encounters an error')
], HttpProxyMiddlewareServer_EncountersError);
let ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer = class ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.proxyRequestListener = TypeMoq.Mock.ofType();
        this.req = new events_1.EventEmitter();
        this.proxyReq = new events_1.EventEmitter();
        this.underTest.addRequestListener(this.proxyRequestListener.object);
        this.underTest.listen(1234);
        this.proxyEventEmitter.emit('proxyReq', this.proxyReq, this.req);
    }
    proxyContextIsCreated() {
        chai.assert.isNotNull(this.req.context);
    }
    proxyContextContainsEmptyBody() {
        this.req.context.request.body.should.be.empty;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer.prototype, "proxyContextIsCreated", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer.prototype, "proxyContextContainsEmptyBody", null);
ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer = __decorate([
    mocha_typescript_1.suite
], ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer);
let ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer = class ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer extends ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer {
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
], ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer.prototype, "proxyContextContainsInitialData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer.prototype, "proxyContextContainsAppendedData", null);
ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer = __decorate([
    mocha_typescript_1.suite
], ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer);
let ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer = class ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer extends ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.req.url = '/url';
        this.req.protocol = 'https';
        this.req.method = 'get';
        this.req.headers = { host: 'host' };
        this.req.emit('end');
    }
    proxyContextContainsNoData() {
        this.req.context.request.body.should.be.empty;
    }
    proxyContextContainsUrl() {
        this.req.context.request.url.should.equal(this.req.url);
    }
    proxyContextContainsHost() {
        this.req.context.request.host.should.equal(this.req.headers.host);
    }
    proxyContextContainsHttpProtocol() {
        this.req.context.request.protocol.should.equal('http');
    }
    proxyContextContainsMethod() {
        this.req.context.request.method.should.equal(this.req.method);
    }
    proxyContextDoesNotContainBody() {
        this.req.context.request.body.should.be.empty;
    }
    proxyContextContainsFullUrl() {
        let context = this.req.context;
        let expectedUrl = `${context.request.protocol}://${context.request.host}${context.request.url}`;
        context.request.fullUrl.should.equal(expectedUrl);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsNoData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsUrl", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsHost", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsHttpProtocol", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsMethod", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextDoesNotContainBody", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsFullUrl", null);
ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer = __decorate([
    mocha_typescript_1.suite
], ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer);
let ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer = class ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer extends ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.req.url = '/url';
        this.req.protocol = 'https';
        this.req.method = 'get';
        this.req.headers = { host: 'host' };
        this.req.emit('end');
    }
    proxyContextContainsData() {
        this.req.context.request.body.should.equal(this.data);
    }
    requestProxyListenerIsNotified() {
        this.proxyRequestListener.verify(x => x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer.prototype, "proxyContextContainsData", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer.prototype, "requestProxyListenerIsNotified", null);
ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer = __decorate([
    mocha_typescript_1.suite
], ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer);
let ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer = class ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.proxyResponseListener = TypeMoq.Mock.ofType();
        this.req = new events_1.EventEmitter();
        this.res = new events_1.EventEmitter();
        this.data = 'TestData';
        this.proxyRes = new events_1.EventEmitter();
        this.proxyRes.headers = new Array();
        this.proxyRes.statusCode = '202';
        this.underTest.addResponseListener(this.proxyResponseListener.object);
        this.req.context = new proxy_context_1.ProxyContext();
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
], ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer.prototype, "noErrorOccurrs", null);
ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer = __decorate([
    mocha_typescript_1.suite
], ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer);
let ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware = class ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware extends ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer {
    before() {
        super.before();
        this.proxyRes.emit('data', this.data);
    }
    dataIsInTheProxyContext() {
        this.req.context.response.body.should.equal(this.data);
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware.prototype, "dataIsInTheProxyContext", null);
ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware = __decorate([
    mocha_typescript_1.suite
], ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware);
//# sourceMappingURL=http-proxymw-server-test.js.map