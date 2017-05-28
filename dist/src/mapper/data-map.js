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
Object.defineProperty(exports, "__esModule", { value: true });
const guards_1 = require("../utils/guards");
class DataMap {
    constructor(log) {
        this.content = new Map();
        // tslint:disable-next-line:triple-equals
        this.log = log;
    }
    toString() {
        let value;
        value = '{';
        for (var key in this.content) {
            value += `\n\t${key} : ${this.content[key]},`;
        }
        value += '\n}';
        return value;
    }
    addContent(jsonContent) {
        var content;
        if (jsonContent && typeof jsonContent === 'object' && jsonContent !== null) {
            content = jsonContent;
        }
        else {
            content = JSON.parse(jsonContent);
        }
        for (var key in content) {
            this.content[key] = jsonContent[key];
        }
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.isJson),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DataMap.prototype, "addContent", null);
exports.DataMap = DataMap;
//# sourceMappingURL=data-map.js.map