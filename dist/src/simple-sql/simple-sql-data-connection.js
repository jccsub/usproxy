"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require('mssql');
class SimpleSqlDataConnection {
    constructor(connectionInfo, log) {
        this.log = log;
        this.pool = null;
        this.config = connectionInfo;
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            var result;
            sql.close();
            try {
                let pool = yield sql.connect(this.config);
                result = yield pool.request()
                    .query(command);
            }
            catch (err) {
                throw err;
            }
            return result;
        });
    }
    getCatalog() {
        return this.config.database;
    }
    getUser() {
        return this.config.user;
    }
    getMachine() {
        return this.config.server;
    }
}
exports.SimpleSqlDataConnection = SimpleSqlDataConnection;
//# sourceMappingURL=simple-sql-data-connection.js.map