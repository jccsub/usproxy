import { TestSetup } from './test-setup';
import { SelectAndReplaceItem } from '../src/proxy/response-select-and-replace';
import { WinstonLog } from '../src/winston-logger';
import { ProxyListener } from '../src/proxy/proxy-listener';
import { ProxyContext } from '../src/proxy/proxy-context';
import { Log } from '../src/logger';


var log = new WinstonLog();

export class HttpBinTestSetup extends TestSetup {

    constructor() {
      super('https://httpbin.org/', 8001);
      log.debug('HttpBinTestSetup');
      this.errorListeners.push(new TestErrorProxyListner());
      this.parseListeners.push(new TestParseProxyListener());
      this.redirectListeners.push(new TestRedirectProxyListener());
      this.requestListeners.push(new TestRequestProxyListener());
      this.responseListeners.push(new TestResponseProxyListener());
      this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener());
      this.responseSelectAndReplaceListeners.push(new TestResponseSelectAndReplaceListener2());
    }

}

class TestErrorProxyListner implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug("testErrorProxyListenr - hello: ")
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestParseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testParsePRoxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestRedirectProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRedirectProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestRequestProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testRequestProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestResponseProxyListener implements ProxyListener {
  handleEvent(logger: Log, context: ProxyContext): boolean {
    log.debug('Hello from testResponseProxyListener');
//    log.debug(`${context.toString()}`);
    return false;
  }
}

class TestResponseSelectAndReplaceListener implements ProxyListener {
  handleEvent(Logger: Log, context : ProxyContext) {
    log.debug('TestResponseSelectAndReplaceListener.handleEvent');
    //let item = new SelectAndReplaceItem('#ENDPOINTS','<h2>MYTITLE</h2>');
    let item = new SelectAndReplaceItem('#ENDPOINTS','<div style="color:red"> - additional text</div>');
    context.selectAndReplaceItems.push(item);
  }
}

class TestResponseSelectAndReplaceListener2 implements ProxyListener {
  handleEvent(Logger: Log, context : ProxyContext) {
    log.debug('TestResponseSelectAndReplaceListener.handleEvent');
    let item = new SelectAndReplaceItem('h1','<h1>Replaced Title!!</h1>');
    context.selectAndReplaceItems.push(item);
  }
}