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
const proxy_context_1 = require("../proxy/proxy-context");
class DataMapper {
    constructor(parser, log) {
        this.log = log;
        this.parser = parser;
    }
    handleEvent(context) {
        let proxyContext = context;
        if (proxyContext.request.body) {
            let parsedBody = this.parse(proxyContext.request.body);
            proxyContext.dataMap.addContent(parsedBody);
        }
    }
    parse(body) {
        return this.parser.parse(body);
    }
}
__decorate([
    guards_1.guarded,
    __param(0, guards_1.notNull),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [proxy_context_1.ProxyContext]),
    __metadata("design:returntype", void 0)
], DataMapper.prototype, "handleEvent", null);
exports.DataMapper = DataMapper;
//# sourceMappingURL=data-mapper.js.map