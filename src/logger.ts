
import * as winston from "winston";

export interface Log {
    level: string;
    debug(message : string) : void;
    warn(message : string) : void;
    error(message : string) : void;
    info(message : string) : void;
}

