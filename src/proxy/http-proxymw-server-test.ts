import { ProxyContext } from './proxy-context';
import { EventEmitter } from 'events';
import { MockProxyEventEmitter } from './mocks/mock-proxyevent-emitter';
import { ProxyEventEmitter } from './proxy-event-emitter';
import { ProxyListener } from './proxy-listener';
import { Application } from '../server/application';
import { HttpProxyMiddlewareServer } from './http-proxymw-server';
import { WebServer } from '../server/web-server';
import { Log } from '../logger';
import { WinstonLog } from '../winston-logger';
import * as TypeMoq from 'typemoq';
import * as chai from 'chai';
import { suite, test, slow, timeout } from 'mocha-typescript';

var should = chai.should();





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
class ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {

  protected proxyRequestListener : TypeMoq.IMock<ProxyListener>;
  private proxyReq : EventEmitter;
  protected req : EventEmitter;

  before() {
    super.before()
    this.proxyRequestListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.req = new EventEmitter();
    this.proxyReq = new EventEmitter();
    this.underTest.addRequestListener(this.proxyRequestListener.object);
    this.underTest.listen(1234);    
    this.proxyEventEmitter.emit('proxyReq', this.proxyReq, this.req);    
  }

  @test
  proxyContextIsCreated() {
    chai.assert.isNotNull((this.req as any).context);
  }

  @test
  proxyContextContainsEmptyBody() {
    ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

}

@suite
class ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer extends ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer {
  protected data : string;

  before() {
    super.before();
    this.data = 'TestData';
    this.req.emit('data',this.data);
  }

  @test
  proxyContextContainsInitialData() {
    ((this.req as any).context as ProxyContext).request.body.should.equal(this.data);
  }

  @test
  proxyContextContainsAppendedData() {
    this.req.emit('data',this.data);
    ((this.req as any).context as ProxyContext).request.body.should.equal(`${this.data}${this.data}`);    
  }
}


@suite
class ProxyReqEndEventFollowsProxyRequest_on_CreatedHttpProxyMiddlwareServer extends ProxyReqEventOccurs_on_CreatedHttpProxyMiddlewareServer {

  before() {
    super.before();
    (this.req as any).url = '/url';
    (this.req as any).protocol = 'https';
    (this.req as any).method = 'get';    
    (this.req as any).headers = { host: 'host'}
    this.req.emit('end');
  }

  @test
  proxyContextContainsNoData() {
    ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

  @test
  proxyContextContainsUrl() {
    ((this.req as any).context as ProxyContext).request.url.should.equal((this.req as any).url);
  }

  @test
  proxyContextContainsHost() {
    ((this.req as any).context as ProxyContext).request.host.should.equal((this.req as any).headers.host);
  }


  @test
  proxyContextContainsHttpProtocol() {
    ((this.req as any).context as ProxyContext).request.protocol.should.equal('http');
  }

  @test
  proxyContextContainsMethod() {
    ((this.req as any).context as ProxyContext).request.method.should.equal((this.req as any).method);
  }

  @test
  proxyContextDoesNotContainBody() {
    ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

  @test
  proxyContextContainsFullUrl() {
    let context = (this.req as any).context as ProxyContext;
    let expectedUrl = `${context.request.protocol}://${context.request.host}${context.request.url}`;
    context.request.fullUrl.should.equal(expectedUrl);
  }
  

}


@suite
class ProxyReqEndEventFollowsDataEvent_on_CreatedHttpProxyMiddlwareServer extends ProxyReqDataEventFollowsProxyRequest_on_CreatedHttpProxyMiddlewareServer {

  before() {
    super.before();
    (this.req as any).url = '/url';
    (this.req as any).protocol = 'https';
    (this.req as any).method = 'get';    
    (this.req as any).headers = { host: 'host'}
    this.req.emit('end');
  }

  @test
  proxyContextContainsData() {
    ((this.req as any).context as ProxyContext).request.body.should.equal(this.data);
  }

  @test
  requestProxyListenerIsNotified() {
    this.proxyRequestListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()),TypeMoq.Times.once());
  }
}


@suite
class ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer extends CreatedHttpProxyMiddlewareServer {

  protected proxyResponseListener : TypeMoq.IMock<ProxyListener>;
  protected proxyRes : EventEmitter;
  protected req : EventEmitter;
  protected res : EventEmitter;
  protected data : string;

  before() {
    super.before();
    this.proxyResponseListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.req = new EventEmitter();
    this.res = new EventEmitter();
    this.data = 'TestData';
    this.proxyRes = new EventEmitter();
    (this.proxyRes as any).headers = new Array<string>();
    (this.proxyRes as any).statusCode = '202';
    this.underTest.addResponseListener(this.proxyResponseListener.object);
    (this.req as any).context = new ProxyContext();
    this.underTest.listen(1234);    
    this.proxyEventEmitter.emit('proxyRes', this.proxyRes, this.req, this.res);    
  }

  @test
  noErrorOccurrs() {
  }


}

@suite
class ProxyResDataEventOccurs_on_CreatedHttpProxyMiddleware extends ProxyResEventOccurs_on_CreatedHttpProxyMiddlewareServer {

  before() {
    super.before();
    this.proxyRes.emit('data',this.data);    
  }


  @test
  dataIsInTheProxyContext() {
    ((this.req as any).context as ProxyContext).response.body.should.equal(this.data);
  }

}
