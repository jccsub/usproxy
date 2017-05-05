"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MockProxyEventEmitter {
    /* istanbul ignore next */
    constructor() {
        this.eventEmitter = new events_1.EventEmitter();
    }
    /* istanbul ignore next */
    emit(name, arg1, arg2, arg3) {
        if (arg2) {
            this.eventEmitter.emit(name, arg1, arg2);
        }
        else if (arg1) {
            this.eventEmitter.emit(name, arg1);
        }
    }
    /* istanbul ignore next */
    on(eventName, callback) {
        this.eventEmitter.on(eventName, callback);
    }
    /* istanbul ignore next */
    web(req, res) {
    }
}
exports.MockProxyEventEmitter = MockProxyEventEmitter;
//# sourceMappingURL=mock-proxyevent-emitter.js.map