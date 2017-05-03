"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeMoq = require("typemoq");
const chai_1 = require("chai");
const http_proxy_server_1 = require("../http-proxy-server");
const mock_proxyevent_emitter_1 = require("../mocks/mock-proxyevent-emitter");
const winston_logger_1 = require("../../winston-logger");
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
//# sourceMappingURL=proxy-test.js.map