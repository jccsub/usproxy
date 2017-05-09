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
const mock_proxyevent_emitter_1 = require("./mocks/mock-proxyevent-emitter");
const http_proxymw_server_1 = require("./http-proxymw-server");
const winston_logger_1 = require("../winston-logger");
const TypeMoq = require("typemoq");
const mocha_typescript_1 = require("mocha-typescript");
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
let RequestIsDetected_on_CreatedHttpProxyMiddlewareServer = class RequestIsDetected_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {
    test() {
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequestIsDetected_on_CreatedHttpProxyMiddlewareServer.prototype, "test", null);
RequestIsDetected_on_CreatedHttpProxyMiddlewareServer = __decorate([
    mocha_typescript_1.suite
], RequestIsDetected_on_CreatedHttpProxyMiddlewareServer);
//# sourceMappingURL=http-proxymw-server-test.js.map