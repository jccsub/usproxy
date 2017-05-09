"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class HttpWebserver {
    startServer(port, callback) {
        http.createServer(callback).listen(port);
    }
}
exports.HttpWebserver = HttpWebserver;
//# sourceMappingURL=http-web-server.js.map