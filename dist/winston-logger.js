"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
class WinstonLog {
    constructor() {
        this.tsFormat = () => (new Date()).toLocaleTimeString();
        this._logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    timestamp: this.tsFormat,
                    colorize: true,
                })
            ]
        });
    }
    get level() {
        return this._logger.level;
    }
    set level(value) {
        this._logger.level = value;
    }
    debug(message) {
        console.log(message);
        this._logger.debug(message);
    }
    warn(message) {
        this._logger.warn(message);
    }
    error(message) {
        this._logger.error(message);
    }
    info(message) {
        this._logger.info(message);
    }
}
exports.WinstonLog = WinstonLog;
//# sourceMappingURL=winston-logger.js.map