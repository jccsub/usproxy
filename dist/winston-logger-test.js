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
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const winston_logger_1 = require("./winston-logger");
let CreatedWinstonLogger = class CreatedWinstonLogger {
    before() {
        chai_1.should();
        this.logger = new winston_logger_1.WinstonLog();
    }
    settingLevelToInfoShouldPersistValue() {
        this.logger.level = 'info';
        this.logger.level.should.equal('info');
    }
    settingLevelToDebugShouldPersistValue() {
        this.logger.level = 'debug';
        this.logger.level.should.equal('debug');
    }
    settingLevelToErrorShouldPersistValue() {
        this.logger.level = 'error';
        this.logger.level.should.equal('error');
    }
    settingLevelToWarnShouldPersistValue() {
        this.logger.level = 'warn';
        this.logger.level.should.equal('warn');
    }
    warnLogsAWarningMessage() {
        this.logger.warn('message');
    }
    debugLogsADebugMessage() {
        this.logger.debug('message');
    }
    errorLogsAnErrorMessage() {
        this.logger.error('test');
    }
    infoLogsAnInfoMessage() {
        this.logger.info('test');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "settingLevelToInfoShouldPersistValue", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "settingLevelToDebugShouldPersistValue", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "settingLevelToErrorShouldPersistValue", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "settingLevelToWarnShouldPersistValue", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "warnLogsAWarningMessage", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "debugLogsADebugMessage", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "errorLogsAnErrorMessage", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedWinstonLogger.prototype, "infoLogsAnInfoMessage", null);
CreatedWinstonLogger = __decorate([
    mocha_typescript_1.suite
], CreatedWinstonLogger);
exports.CreatedWinstonLogger = CreatedWinstonLogger;
//# sourceMappingURL=winston-logger-test.js.map