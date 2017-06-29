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
const data_map_1 = require("./data-map");
const guards_1 = require("../utils/guards");
class DataMapWriter {
    constructor(dataWriter, log) {
        this.dataWriter = dataWriter;
        this.log = log;
    }
    write(dataMapToWrite) {
        this.dataWriter.write(dataMapToWrite);
    }
}
__decorate([
    guards_1.guarded,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_map_1.DataMap]),
    __metadata("design:returntype", void 0)
], DataMapWriter.prototype, "write", null);
exports.DataMapWriter = DataMapWriter;
//# sourceMappingURL=data-map-writer.js.map