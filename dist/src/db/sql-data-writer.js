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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const guards_1 = require("../utils/guards");
class SqlDataWriter {
    constructor(connection, sqlInsertGenerator, sqlTableGenerator, dataValidator) {
        this.dataValidator = dataValidator;
        this.connection = connection;
        this.sqlInsertGenerator = sqlInsertGenerator;
        this.sqlTableGenerator = sqlTableGenerator;
        this.createDatabaseIfItDoesNotExist();
        this.createTableIfItDoesNotExist();
    }
    write(dataToWrite) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataValidator.validate(dataToWrite);
            return yield this.execute(this.sqlInsertGenerator.generateInsertStatement(dataToWrite)).then((result) => {
                // tslint:disable-next-line:triple-equals
                if (result == null) {
                    throw new Error('SqlDataWriter.write - Did not receive a result back');
                }
                return result.rowsAffected[0];
            });
        });
    }
    createDatabaseIfItDoesNotExist() {
    }
    createTableIfItDoesNotExist() {
        let sqlText = this.sqlTableGenerator.generateCreateTableIfItDoesNotExist();
        this.execute(sqlText);
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.execute(command);
        });
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.isJson),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SqlDataWriter.prototype, "write", null);
exports.SqlDataWriter = SqlDataWriter;
//# sourceMappingURL=sql-data-writer.js.map