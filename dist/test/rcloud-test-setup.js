"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_logger_1 = require("../src/winston-logger");
const response_select_and_replace_1 = require("../src/proxy/response-select-and-replace");
const test_setup_1 = require("./test-setup");
var log = new winston_logger_1.WinstonLog();
class RCloudTestSetup extends test_setup_1.TestSetup {
    constructor() {
        super('http://jccsubweb.newgen.corp', 8001);
        log.debug('RCloudTestSetup');
        this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener());
    }
}
exports.RCloudTestSetup = RCloudTestSetup;
class TestResponseSelectAndReplaceListener {
    handleEvent(context) {
        log.debug('TestResponseSelectAndReplaceListener.handleEvent');
        let item = new response_select_and_replace_1.HtmlModification('#ctl00_Content_EntityDataSource1', '<h2>Chad\'s text</h2><span id="ctl00_Content_EntityDataSource1"></span>', response_select_and_replace_1.HtmlChangeType.Replace);
        context.htmlModifications.push(item);
    }
}
//# sourceMappingURL=rcloud-test-setup.js.map