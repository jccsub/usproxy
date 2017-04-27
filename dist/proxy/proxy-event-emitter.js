"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
class ProxyEventEmitter {
    constructor(eventName) {
        this.eventEmitter = new events.EventEmitter();
        this.eventName = eventName;
    }
    emit(data) {
        this.eventEmitter.emit(this.eventName, data);
    }
    addEventListener(listener) {
        this.eventEmitter.on(this.eventName, listener);
    }
    removeEventListener(listener) {
        this.eventEmitter.removeListener(this.eventName, listener);
    }
}
exports.ProxyEventEmitter = ProxyEventEmitter;
//# sourceMappingURL=proxy-event-emitter.js.map