import { MarkupModifier } from '../src/infusion-server/application-services/markup-modifier';
import { InfusionModification, InfusionModificationType } from '../src/infusion-server/domain/infusion-modification';
import { InfusionConfiguration } from '../src/infusion-server/domain/infusion-configuration';
import { ProxyService } from '../src/infusion-server/application-services/proxy-service';
import { InfusionPlugin } from '../src/infusion-server/domain/infusion-plugin';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import { TestSetup } from './test-setup';


const port = 8001;
const target = 'https://httpbin.org/'

export class OnionTestSetup  {

  private log : Log;

  private proxyService : ProxyService;

  private configuration : InfusionConfiguration = new InfusionConfiguration();

  private markupModifier : MarkupModifier;
  public startTest() {
    this.log = new WinstonLog();
    this.configuration.modifications =  [
      new InfusionModification('h1','<h1>Replaced Title!!</h1>',InfusionModificationType.Replace)
    ];
    this.markupModifier = new MarkupModifier(this.configuration);
    this.proxyService = new ProxyService(this.log, this.markupModifier, this.configuration );
    this.proxyService.listen(target, port);
  }

}