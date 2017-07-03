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
const winston_logger_1 = require("../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const simple_sql_data_connection_1 = require("./simple-sql-data-connection");
const simple_sql_configuration_1 = require("./simple-sql-configuration");
class SimpleSqlDataConnectionTests {
    createConnectionInfo() {
        let connectionInfo = new simple_sql_configuration_1.SimpleSqlConfiguration();
        connectionInfo.server = 'localhost';
        connectionInfo.database = 'usproxy';
        connectionInfo.user = 'dev';
        connectionInfo.password = 'usg';
        return connectionInfo;
    }
    createConnection() {
        return new simple_sql_data_connection_1.SimpleSqlDataConnection(this.createConnectionInfo(), this.log);
    }
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.dataConnection = this.createConnection();
    }
}
let SqlDataConnectionInfoTests = class SqlDataConnectionInfoTests extends SimpleSqlDataConnectionTests {
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
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SqlDataConnectionInfoTests.prototype, "getUserReturnsTheDatabaseUser", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SqlDataConnectionInfoTests.prototype, "getMachineReturnsTheDatabaseServer", null);
SqlDataConnectionInfoTests = __decorate([
    mocha_typescript_1.suite
], SqlDataConnectionInfoTests);
let SqlDataConnectionExecuteTests = class SqlDataConnectionExecuteTests extends SimpleSqlDataConnectionTests {
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
                        /* istanbul ignore next */
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    executingASelectThatReturnsZeroRowsIsSuccessful() {
        return __awaiter(this, void 0, void 0, function* () {
            /* istanbul ignore next */
            yield this.dataConnection.execute('select * from master..sysdatabases where name = \'no_database\'').then((result) => {
                return new Promise((resolve, reject) => {
                    try {
                        chai_1.expect(result.recordset.length).to.equal(0);
                    }
                    /* istanbul ignore next */
                    catch (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    executingAnInvalidCommandResultsInAnException() {
        return __awaiter(this, void 0, void 0, function* () {
            let expectedException = false;
            /* istanbul ignore next */
            yield this.dataConnection.execute('invalid select command').then((result) => {
                return new Promise((resolve, reject) => {
                    try {
                        chai_1.expect(result.recordset.length).to.equal(0);
                    }
                    catch (err) {
                        reject(err);
                    }
                    resolve();
                });
            }).catch(onrejected => {
                expectedException = true;
            });
            /* istanbul ignore next */
            if (!expectedException) {
                throw new Error('expected exception');
            }
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
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SqlDataConnectionExecuteTests.prototype, "executingAnInvalidCommandResultsInAnException", null);
SqlDataConnectionExecuteTests = __decorate([
    mocha_typescript_1.suite
], SqlDataConnectionExecuteTests);
//# sourceMappingURL=simple-sql-data-connection-test.js.map