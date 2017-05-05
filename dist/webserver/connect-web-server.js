"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class ConnectWebServer {
    /* istanbul ignore next */
    constructor(logger) {
        this.app = require('connect')();
        this.app.use((req, res, next) => {
            next();
        });
    }
    /* istanbul ignore next */
    use(callback) {
        this.app.use(callback);
    }
    /* istanbul ignore next */
    listen(port) {
        http.createServer(this.app).listen(port);
    }
}
exports.ConnectWebServer = ConnectWebServer;
//# sourceMappingURL=connect-web-server.js.map