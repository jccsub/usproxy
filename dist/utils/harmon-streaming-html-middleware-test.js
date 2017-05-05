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
const harmon_streaming_html_middleware_1 = require("./harmon-streaming-html-middleware");
const winston_logger_1 = require("../winston-logger");
let CreatedMiddleware = class CreatedMiddleware {
    before() {
        this.log = new winston_logger_1.WinstonLog();
        this.middleware = new harmon_streaming_html_middleware_1.HarmonStreamingHtmlMiddleware(this.log);
    }
    notEasilyTestable() {
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreatedMiddleware.prototype, "notEasilyTestable", null);
CreatedMiddleware = __decorate([
    mocha_typescript_1.suite
], CreatedMiddleware);
//# sourceMappingURL=harmon-streaming-html-middleware-test.js.map