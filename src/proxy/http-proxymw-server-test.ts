import { MockProxyEventEmitter } from './mocks/mock-proxyevent-emitter';
import { ProxyEventEmitter } from './proxy-event-emitter';
import { ProxyListener } from './proxy-listener';
import { Application } from '../server/application';
import { HttpProxyMiddlewareServer } from './http-proxymw-server';
import { WebServer } from '../server/web-server';
import { Log } from '../logger';
import { WinstonLog } from '../winston-logger';
import * as TypeMoq from 'typemoq';

import { suite, test, slow, timeout } from 'mocha-typescript';

class CreatedHttpProxyMiddlewareServer {
  protected log : Log;
  protected webServer : TypeMoq.IMock<WebServer>;
  protected app : TypeMoq.IMock<Application>;
  protected underTest : HttpProxyMiddlewareServer;
  protected proxyEventEmitter : MockProxyEventEmitter;

  before() {
    this.log = new WinstonLog();
    this.app = TypeMoq.Mock.ofType<Application>();
    this.webServer =  TypeMoq.Mock.ofType<WebServer>();
    this.proxyEventEmitter = new MockProxyEventEmitter();
    this.underTest = new HttpProxyMiddlewareServer(this.proxyEventEmitter, this.webServer.object,this.app.object, this.log);    
  }
}


@suite('HttpProxyMiddlewareServer encounters an error')
class HttpProxyMiddlewareServer_EncountersError extends CreatedHttpProxyMiddlewareServer {

  private errorListener : TypeMoq.IMock<ProxyListener>;

  before() {
    super.before();
    this.errorListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.underTest.addErrorListener(this.errorListener.object);
    this.underTest.listen(1234);
    
    this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'));
  }

  @test
  handleEventsShouldBeCalled() {
    this.errorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAny()),TypeMoq.Times.once());
  }


}

@suite
class RequestIsDetected_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {

  @test
  test() {

  }

}


