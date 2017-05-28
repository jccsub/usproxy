import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import { ProxyContext } from '../src/proxy/proxy-context';
import { HtmlChangeType, HtmlModification } from '../src/proxy/response-select-and-replace';
import { ProxyListener } from '../src/proxy/proxy-listener';
import { TestSetup } from './test-setup';

var log : Log = new WinstonLog();

export class RCloudTestSetup extends TestSetup {


  constructor() {    
    super('http://jccsubweb.newgen.corp',8001);
    log.debug('RCloudTestSetup');
    this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener());
  }

}

class TestResponseSelectAndReplaceListener implements ProxyListener {
  handleEvent(context : ProxyContext) {
    log.debug('TestResponseSelectAndReplaceListener.handleEvent');
    let item = new HtmlModification('#ctl00_Content_EntityDataSource1','<h2>Chad\'s text</h2><span id="ctl00_Content_EntityDataSource1"></span>', HtmlChangeType.Replace);
    context.htmlModifications.push(item);
  }
}