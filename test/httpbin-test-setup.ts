import { TestSetup } from './test-setup';
import { SelectAndReplaceType, SelectAndReplaceItem } from '../src/server/proxy/response-select-and-replace';
import { WinstonLog } from '../src/winston-logger';
import { ProxyListener } from '../src/server/proxy/proxy-listener';
import { ProxyContext } from '../src/server/proxy/proxy-context';
import { Log } from '../src/logger';


var log = new WinstonLog();

export class HttpBinTestSetup extends TestSetup {

    constructor() {
      super('https://httpbin.org/', 8001);
      log.debug('HttpBinTestSetup -> Navigate to http://localhost:8001 to test');
      this.errorListeners.push(new TestErrorProxyListner());
      this.requestListeners.push(new TestRequestProxyListener());
      this.responseListeners.push(new TestResponseProxyListener());
      this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener());
      this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener2());
    }

}

class TestErrorProxyListner implements ProxyListener {
  handleEvent(context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestRequestProxyListener implements ProxyListener {
  handleEvent(context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestResponseProxyListener implements ProxyListener {
  handleEvent(context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestResponseSelectAndReplaceListener implements ProxyListener {
  handleEvent(context : ProxyContext) {
    log.debug('TestResponseSelectAndReplaceListener.handleEvent');
    //let item = new SelectAndReplaceItem('#ENDPOINTS','<h2>MYTITLE</h2>');
    let item = new SelectAndReplaceItem('#ENDPOINTS','<div style="color:red"> - additional text</div>',SelectAndReplaceType.Append);
    context.htmlModifications.push(item);
  }
}

class TestResponseSelectAndReplaceListener2 implements ProxyListener {
  handleEvent(context : ProxyContext) {
    log.debug('TestResponseSelectAndReplaceListener.handleEvent');
    let item = new SelectAndReplaceItem('h1','<h1>Replaced Title!!</h1>', SelectAndReplaceType.Replace);
    context.htmlModifications.push(item);
  }
}