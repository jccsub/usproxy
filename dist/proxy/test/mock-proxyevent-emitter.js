"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MockProxyEventEmitter {
    constructor() {
        this.eventEmitter = new events_1.EventEmitter();
    }
    emit(name, arg1, arg2, arg3) {
        if (arg3) {
            this.eventEmitter.emit(name, arg1, arg2, arg3);
        }
        else if (arg2) {
            this.eventEmitter.emit(name, arg1, arg2);
        }
        if (arg1) {
            this.eventEmitter.emit(name, arg1);
        }
    }
    on(eventName, callback) {
        this.eventEmitter.on(eventName, callback);
    }
    web(req, res) {
    }
}
exports.MockProxyEventEmitter = MockProxyEventEmitter;
//# sourceMappingURL=mock-proxyevent-emitter.js.map