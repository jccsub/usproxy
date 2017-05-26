"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect = require("connect");
class ConnectApplication {
    constructor() {
        this.app = connect();
    }
    get requestListener() {
        return this.app;
    }
    use(callback) {
        this.app.use(callback);
    }
}
exports.ConnectApplication = ConnectApplication;
//# sourceMappingURL=connect-application.js.map