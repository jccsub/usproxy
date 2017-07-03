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
const guards_1 = require("../utils/guards");
class SimpleSqlSchemaValidator {
    constructor(tableSchema, log) {
        this.tableSchema = tableSchema;
        this.log = log;
    }
    validate() {
        this.validateTableMustHaveOneColumnThatIsNeitherIdentityNorOptional();
    }
    validateTableMustHaveOneColumnThatIsNeitherIdentityNorOptional() {
        let found = false;
        this.tableSchema.forEach((column) => {
            if (!column.isIdentity() && !column.isOptional()) {
                found = true;
            }
        });
        if (!found) {
            throw new Error('SimpleSqlSchemaValidator - A table must have one column that is neither identity nor optional');
        }
    }
}
__decorate([
    guards_1.guarded,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleSqlSchemaValidator.prototype, "validate", null);
exports.SimpleSqlSchemaValidator = SimpleSqlSchemaValidator;
//# sourceMappingURL=simple-sql-schema-validator.js.map