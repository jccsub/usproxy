"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_setup_1 = require("./test-setup");
const response_select_and_replace_1 = require("../src/proxy/response-select-and-replace");
const winston_logger_1 = require("../src/winston-logger");
var log = new winston_logger_1.WinstonLog();
class HttpBinTestSetup extends test_setup_1.TestSetup {
    constructor() {
        super('https://httpbin.org/', 8001);
        log.debug('HttpBinTestSetup');
        this.errorListeners.push(new TestErrorProxyListner());
        this.parseListeners.push(new TestParseProxyListener());
        this.redirectListeners.push(new TestRedirectProxyListener());
        this.requestListeners.push(new TestRequestProxyListener());
        this.responseListeners.push(new TestResponseProxyListener());
        this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener());
        this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener2());
    }
}
exports.HttpBinTestSetup = HttpBinTestSetup;
class TestErrorProxyListner {
    handleEvent(context) {
        log.debug("testErrorProxyListenr - hello: ");
        //    log.debug(`${context.toString()}`);
        return false;
    }
}
class TestParseProxyListener {
    handleEvent(context) {
        log.debug('Hello from testParsePRoxyListener');
        //    log.debug(`${context.toString()}`);
        return false;
    }
}
class TestRedirectProxyListener {
    handleEvent(context) {
        log.debug('Hello from testRedirectProxyListener');
        //    log.debug(`${context.toString()}`);
        return false;
    }
}
class TestRequestProxyListener {
    handleEvent(context) {
        log.debug('Hello from testRequestProxyListener');
        //    log.debug(`${context.toString()}`);
        return false;
    }
}
class TestResponseProxyListener {
    handleEvent(context) {
        log.debug('Hello from testResponseProxyListener');
        //    log.debug(`${context.toString()}`);
        return false;
    }
}
class TestResponseSelectAndReplaceListener {
    handleEvent(context) {
        log.debug('TestResponseSelectAndReplaceListener.handleEvent');
        //let item = new SelectAndReplaceItem('#ENDPOINTS','<h2>MYTITLE</h2>');
        let item = new response_select_and_replace_1.HtmlModification('#ENDPOINTS', '<div style="color:red"> - additional text</div>', response_select_and_replace_1.HtmlChangeType.Append);
        context.htmlModifications.push(item);
    }
}
class TestResponseSelectAndReplaceListener2 {
    handleEvent(context) {
        log.debug('TestResponseSelectAndReplaceListener.handleEvent');
        let item = new response_select_and_replace_1.HtmlModification('h1', '<h1>Replaced Title!!</h1>', response_select_and_replace_1.HtmlChangeType.Replace);
        context.htmlModifications.push(item);
    }
}
//# sourceMappingURL=httpbin-test-setup.js.map