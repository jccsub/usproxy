"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const markup_modifier_1 = require("../src/infusion-server/application-services/markup-modifier");
const infusion_modification_1 = require("../src/infusion-server/domain/infusion-modification");
const infusion_configuration_1 = require("../src/infusion-server/domain/infusion-configuration");
const proxy_service_1 = require("../src/infusion-server/application-services/proxy-service");
const winston_logger_1 = require("../src/winston-logger");
const port = 8001;
const target = 'https://httpbin.org/';
class OnionTestSetup {
    constructor() {
        this.configuration = new infusion_configuration_1.InfusionConfiguration();
    }
    startTest() {
        this.log = new winston_logger_1.WinstonLog();
        this.configuration.modifications = [
            new infusion_modification_1.InfusionModification('h1', '<h1>Replaced Title!!</h1>', infusion_modification_1.InfusionModificationType.Replace)
        ];
        this.markupModifier = new markup_modifier_1.MarkupModifier(this.configuration);
        this.proxyService = new proxy_service_1.ProxyService(this.log, this.markupModifier, this.configuration);
        this.proxyService.listen(target, port);
    }
}
exports.OnionTestSetup = OnionTestSetup;
//# sourceMappingURL=onion-test-setup.js.map