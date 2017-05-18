import { Log } from '../logger';
import { Application } from '../server/application';
import { WebServer } from '../server/web-server';
import { WinstonLog } from '../winston-logger';
import { HttpProxyMiddlewareServer } from './http-proxymw-server';
import { MockProxyEventEmitter } from './mocks/mock-proxyevent-emitter';
import { ProxyContext } from './proxy-context';
import { ProxyListener } from './proxy-listener';
import * as chai from 'chai';
import { EventEmitter } from 'events';
import { suite, test } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';

var should = chai.should();





class HttpProxyMiddlewareServerTest {
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

class EncountersError extends HttpProxyMiddlewareServerTest {

  private errorListener : TypeMoq.IMock<ProxyListener>;

  before() {
    super.before();
    this.errorListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.underTest.addErrorListener(this.errorListener.object);
    this.underTest.listen(1234);
   
  }

  @test
  ifBeforeAProxyRequestHandleEventsAreCalledWithErrorObject() {
    this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'));    
    this.errorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(Error)),TypeMoq.Times.once());
  }

  @test
  ifAfterAProxyRequestHandleEventsAreCalledWithContextObject() {
    let proxyReq = new EventEmitter();
    let req = new EventEmitter();
    let called : boolean = false;
    this.errorListener.setup(x=>x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(ProxyContext))).callback((l : Log,c : ProxyContext) => {
      called = true;
      c.request.body.should.equal('TestData');
    });
    this.proxyEventEmitter.emit('proxyReq', proxyReq, req);    
    req.emit('data', 'TestData')
    this.proxyEventEmitter.emit('error', new Error('Error Message Goes Here'), req);    
    var x = called.should.be.true;
  }  
}

@suite('HttpProxyMiddlewareServer emits proxyReq event')
class EmitsProxyReqEvent extends HttpProxyMiddlewareServerTest {

  protected proxyRequestListener : TypeMoq.IMock<ProxyListener>;
  private proxyReq : EventEmitter;
  protected req : EventEmitter;

  before() {
    super.before()
    this.proxyRequestListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.req = new EventEmitter();
    this.proxyReq = new EventEmitter();
    (this.req as any).url = '/url';
    (this.req as any).protocol = 'https';
    (this.req as any).method = 'get';    
    (this.req as any).headers = { host: 'host'}    
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
    var x = ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

}

@suite("HttpProxyMiddlewareServer's proxyReq emits a data event")
class ProxyReqEmitsDataEvent extends EmitsProxyReqEvent {
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


@suite("HttpProxyMiddlewareServer's proxyReq emits an end event")
class ProxyReqEmitsEndEvent extends EmitsProxyReqEvent {
  protected data : string;

  before() {
    super.before();
    this.data = 'testdata';
    (this.req as any).url = '/url';
    (this.req as any).protocol = 'https';
    (this.req as any).method = 'get';    
    (this.req as any).headers = { host: 'host'}
  }

  @test
  proxyContextContainsNoData() {
    this.req.emit('end');    
    var x = ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

  @test
  proxyContextContainsUrl() {
    this.req.emit('end');    
    ((this.req as any).context as ProxyContext).request.url.should.equal((this.req as any).url);
  }

  @test
  proxyContextContainsHost() {
    this.req.emit('end');   
    ((this.req as any).context as ProxyContext).request.host.should.equal((this.req as any).headers.host);
  }


  @test
  proxyContextContainsHttpProtocol() {
    this.req.emit('end');    
    ((this.req as any).context as ProxyContext).request.protocol.should.equal('http');
  }

  @test
  proxyContextContainsMethod() {
    this.req.emit('end');
    ((this.req as any).context as ProxyContext).request.method.should.equal((this.req as any).method);
  }

  @test
  proxyContextDoesNotContainBody() {
    this.req.emit('end');
    var x = ((this.req as any).context as ProxyContext).request.body.should.be.empty;
  }

  @test
  proxyContextContainsFullUrl() {
    this.req.emit('end');
    let context = (this.req as any).context as ProxyContext;
    let expectedUrl = `${context.request.protocol}://${context.request.host}${context.request.url}`;
    context.request.fullUrl.should.equal(expectedUrl);
  }
  
  @test
  proxyContextContainsData() {
    this.req.emit('data',this.data);
    this.req.emit('end');    
    ((this.req as any).context as ProxyContext).request.body.should.equal(this.data);
  } 

}


@suite('HttpProxyMiddlewareServer emits proxyRes event')
class EmitsProxyResEvent extends HttpProxyMiddlewareServerTest {

  protected proxyResponseListener : TypeMoq.IMock<ProxyListener>;
  protected proxyRes : EventEmitter;
  protected req : EventEmitter;
  protected res : EventEmitter;
  protected data : string;
  protected headerText : string;
  protected statusCodeText : string;

  before() {
    super.before();
    this.proxyResponseListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.req = new EventEmitter();
    this.res = new EventEmitter();
    this.data = 'TestData';
    this.headerText = 'Header1';
    this.statusCodeText = '202';
    this.proxyRes = new EventEmitter();
    (this.proxyRes as any).headers = new Array<string>();
    (this.proxyRes as any).headers.push(this.headerText);
    (this.proxyRes as any).statusCode = this.statusCodeText;
    this.underTest.addResponseListener(this.proxyResponseListener.object);
    (this.req as any).context = new ProxyContext();
    this.underTest.listen(1234);    
    this.proxyEventEmitter.emit('proxyRes', this.proxyRes, this.req, this.res);    
  }

  @test
  noErrorOccurrs() {
  }


}

@suite("HttpProxyMiddleware's proxyRes emits data event")
class ProxyResEmitsDataEvent extends EmitsProxyResEvent {

  before() {
    super.before();
    this.proxyResponseListener = TypeMoq.Mock.ofType<ProxyListener>();    
    this.underTest.addResponseListener(this.proxyResponseListener.object);
    this.proxyRes.emit('data',this.data);    
  }

  @test
  dataIsInTheProxyContext() {
    ((this.req as any).context as ProxyContext).response.body.should.equal(this.data);
  }

  @test
  handleEventIsNotCalled() {
    this.proxyResponseListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(ProxyContext)), TypeMoq.Times.never());
  }

}

@suite("HttpProxyMiddleware's proxyRes emits end event")
class ProxyResEmitsEndEvent extends EmitsProxyResEvent {

  before() {
    super.before();
    this.proxyResponseListener = TypeMoq.Mock.ofType<ProxyListener>();    
    this.underTest.addResponseListener(this.proxyResponseListener.object);
  }

  @test
  handleEventIsCalled() {
    this.proxyRes.emit('data',this.data);    
    this.proxyRes.emit('end');                
    this.proxyResponseListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(), TypeMoq.It.isAnyObject(ProxyContext)), TypeMoq.Times.once());
  }

  @test
  proxyContextContainsHeaders() {
    this.proxyRes.emit('end');                
    ((this.req as any).context as ProxyContext).response.headers.length.should.equal(1);
    ((this.req as any).context as ProxyContext).response.headers[0].should.equal(this.headerText);
  }
  
  @test
  proxyContextContainsStatusCode() {
    this.proxyRes.emit('end');                
    ((this.req as any).context as ProxyContext).response.statusCode.should.equal(this.statusCodeText);
  }

  @test
  proxyContextContainsAppendedResponseData() {
    this.proxyRes.emit('data',this.data);    
    this.proxyRes.emit('data',this.data);        
    this.proxyRes.emit('end');                
    ((this.req as any).context as ProxyContext).response.body.should.equal(`${this.data}${this.data}`);
  }
  
}
