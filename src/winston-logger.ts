
import * as winston from "winston";
import {Log} from './logger';


export class WinstonLog implements Log {
    private tsFormat = () => (new Date()).toLocaleTimeString();
    private _logger : winston.LoggerInstance;

    constructor() {
        this._logger = new (winston.Logger)({
            transports: [
            new (winston.transports.Console)({
                timestamp: this.tsFormat,
                colorize: true,
            })
            ]    
        });
    }

    get level() : string {
        return this._logger.level;
    }

    set level(value : string) {
        this._logger.level = value;
    }

    public debug(message : string) {
        console.log(message);
        this._logger.debug(message);
    }

    public warn(message : string) {
        this._logger.warn(message);
    }

    public error(message : string) {
        this._logger.error(message);
    }
    
    public info(message : string) {
        this._logger.info(message);
    }

}

