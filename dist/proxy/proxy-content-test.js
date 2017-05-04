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
const proxy_context_1 = require("./proxy-context");
const chai_1 = require("chai");
let ProxyContextIsCreated = class ProxyContextIsCreated {
    before() {
        chai_1.should();
        this.proxyContext = new proxy_context_1.ProxyContext();
    }
    responsePropertyShouldBeInitialized() {
        this.proxyContext.response.should.not.be.null;
    }
    requestPropertyShouldBeInitialized() {
        this.proxyContext.request.should.not.be.null;
    }
    dataMapShouldBeInitialized() {
        this.proxyContext.request.should.not.be.null;
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyContextIsCreated.prototype, "responsePropertyShouldBeInitialized", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyContextIsCreated.prototype, "requestPropertyShouldBeInitialized", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyContextIsCreated.prototype, "dataMapShouldBeInitialized", null);
ProxyContextIsCreated = __decorate([
    mocha_typescript_1.suite
], ProxyContextIsCreated);
//# sourceMappingURL=proxy-content-test.js.map