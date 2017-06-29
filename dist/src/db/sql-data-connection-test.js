"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_data_connection_1 = require("./sql-data-connection");
const winston_logger_1 = require("../winston-logger");
const sql_configuration_1 = require("./sql-configuration");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
class SqlDataConnectionTests {
    createConnectionInfo() {
        let connectionInfo = new sql_configuration_1.SqlConfiguration();
        connectionInfo.server = 'localhost';
        connectionInfo.database = 'usproxy';
        connectionInfo.user = 'dev';
        connectionInfo.password = 'usg';
        return connectionInfo;
    }
    createConnection() {
        return new sql_data_connection_1.SqlDataConnection(this.createConnectionInfo(), this.log);
    }
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.dataConnection = this.createConnection();
    }
}
let SqlDataConnectionInfoTests = class SqlDataConnectionInfoTests extends SqlDataConnectionTests {
    getCatalogReturnsTheDatabaseName() {
        this.dataConnection.getCatalog().should.equal('usproxy');
    }
    getUserReturnsTheDatabaseUser() {
        this.dataConnection.getUser().should.equal('dev');
    }
    getMachineReturnsTheDatabaseServer() {
        this.dataConnection.getMachine().should.equal('localhost');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SqlDataConnectionInfoTests.prototype, "getCatalogReturnsTheDatabaseName", null);
SqlDataConnectionInfoTests = __decorate([
    mocha_typescript_1.suite
], SqlDataConnectionInfoTests);
let SqlDataConnectionExecuteTests = class SqlDataConnectionExecuteTests extends SqlDataConnectionTests {
    before() {
        super.before();
    }
    after() {
    }
    executingASelectThatReturnsMoreThanOneRowIsSuccessful() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataConnection.execute('select * from master..sysdatabases').then((result) => {
                return new Promise((resolve, reject) => {
                    try {
                        chai_1.expect(result.recordset.length).to.be.greaterThan(1);
                    }
                    catch (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    executingASelectThatReturnsZeroRowsIsSuccessful() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataConnection.execute('select * from master..sysdatabases where name = \'no_database\'').then((result) => {
                return new Promise((resolve, reject) => {
                    try {
                        chai_1.expect(result.recordset.length).to.equal(0);
                    }
                    catch (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SqlDataConnectionExecuteTests.prototype, "executingASelectThatReturnsMoreThanOneRowIsSuccessful", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SqlDataConnectionExecuteTests.prototype, "executingASelectThatReturnsZeroRowsIsSuccessful", null);
SqlDataConnectionExecuteTests = __decorate([
    mocha_typescript_1.suite
], SqlDataConnectionExecuteTests);
//# sourceMappingURL=sql-data-connection-test.js.map