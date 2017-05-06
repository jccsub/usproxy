import { suite, test, slow, timeout } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from './../logger';

import {HttpProxyServer} from './http-proxy-server';
import {ProxyEventEmitter} from './proxy-event-emitter';
import {ProxyContext} from './proxy-context';
import {WebServer} from './../webserver/web-server';
import {ProxyListener} from './proxy-listener';
import {MockProxyEventEmitter} from './mocks/mock-proxyevent-emitter';
import {WinstonLog}  from './../winston-logger';
import {StreamingHtmlMiddleware, SelectAndReplaceItem} from './../utils/streaming-html-middleware';
import {EventEmitter} from 'events';

class ProxyTest {  
  protected mockWebServer : TypeMoq.IMock<WebServer>;
  protected proxyServer : HttpProxyServer;
  protected mockErrorListener : TypeMoq.IMock<ProxyListener>;
  protected mockResponseListener : TypeMoq.IMock<ProxyListener>;
  protected mockProxyEventEmitter : MockProxyEventEmitter;  
  protected mockRequestListener : TypeMoq.IMock<ProxyListener>;
  protected mockStreamingHtml : TypeMoq.IMock<StreamingHtmlMiddleware>;
  protected log : Log;

  public before() {    
    this.log = new WinstonLog();   
    this.mockWebServer = TypeMoq.Mock.ofType<WebServer>();
    this.mockStreamingHtml = TypeMoq.Mock.ofType<StreamingHtmlMiddleware>();
    this.mockProxyEventEmitter = new MockProxyEventEmitter();    
    this.mockStreamingHtml.setup(x=>x.selectAndReplaceItems).returns(()=> { 
      return new Array<SelectAndReplaceItem>() 
    });
    this.mockStreamingHtml.setup(x=>x.selectAndReplaceCallback).returns(()=>{ 
      return (req,res,next)=>{} 
    });    
    this.mockWebServer.setup(x=>x.listen(TypeMoq.It.isAny()));
    this.mockWebServer.setup(x=>x.use(TypeMoq.It.isAny()));
    this.proxyServer = new HttpProxyServer(
      this.mockProxyEventEmitter,
      this.mockWebServer.object, 
      this.mockStreamingHtml.object,
      this.log);    
    this.mockErrorListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.mockResponseListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.mockRequestListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.proxyServer.addErrorListener(this.mockErrorListener.object);   
    this.proxyServer.addResponseListener(this.mockResponseListener.object);
    this.proxyServer.addRequestListener(this.mockRequestListener.object);
    this.proxyServer.listen(1234,'');
    should();
  }
}


@suite
class ErrorEmittedBeforeARequestIsMade extends ProxyTest{

  @test
  public shouldCallHandleEventOnce() {
    let e = new Error('Again');
    this.mockProxyEventEmitter.emit('error',e);
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()),TypeMoq.Times.once());
  }

  @test
  public shouldCallHandleEventWithTheEmittedErrorObject() {
    let e = new Error('Again');
    this.mockProxyEventEmitter.emit('error',new Error('Just testing'));
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAnyObject(Error)),TypeMoq.Times.once());
  }
}

@suite
class ErrorEmittedAfterARequestIsMade extends ProxyTest {

  @test
  public shouldCallHandleEventOnce() {
    let e = new Error('Again');
    this.mockProxyEventEmitter.emit('proxyReq');
    this.mockProxyEventEmitter.emit('error',e);
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()),TypeMoq.Times.once());    
  }

  @test
  public shouldCallHandleEventWithProxyContext() {
    let context = new ProxyContext();
    let request : any = {};
    request.context = new ProxyContext();
    this.mockProxyEventEmitter.emit('error',new Error('Error Message'), request);
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAnyObject(ProxyContext)),TypeMoq.Times.once());    
  }

  @test
  public shouldCallHandleEventWithProxyContextContainingError() {
    let context = new ProxyContext();
    let request : any = {};
    this.mockErrorListener.setup(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAnyObject(ProxyContext))).callback((l,c : ProxyContext) => {
      c.error.message.should.equal('Error Message');
    });       
    request.context = new ProxyContext();
    this.mockProxyEventEmitter.emit('error',new Error('Error Message'), request);
  }
}


@suite
export class ResponseIsReturnedAfterARequest extends ProxyTest {

  @test
  public shouldCallHandleEventWithProxyContent() {
    let context = new ProxyContext();
    let request : any = {};
    request.context = new ProxyContext();
    request.message = 'testing';
    let proxyRes = new EventEmitter();
    let res = {};
    (proxyRes as any).headers = new Array<string>();
    (proxyRes as any).headers.push('header1');
    (proxyRes as any).headers.push('header2');
    (proxyRes as any).statusCode = '123';  
    this.mockProxyEventEmitter.emit('proxyRes',proxyRes,request);    
    proxyRes.emit('end');  
    this.mockResponseListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()) ,TypeMoq.Times.once());
  }

}

@suite
class ProxyResponseDataEventOccurs extends ProxyTest {

  @test
  contextResponseBodyHasData() {
    let proxyRes = new EventEmitter();
    let req: any = {};
    req.context = new ProxyContext();    
    this.mockProxyEventEmitter.emit('proxyRes', proxyRes, req);
    let chunk = 'TestData';
    proxyRes.emit('data',chunk);
    req.context.response.body.should.equal('TestData');
  }

}


@suite 
class ProxyRequestOccurs extends ProxyTest {

  private req : EventEmitter;

  before() {
    super.before();
    this.req = new EventEmitter();
    let proxyReq = new EventEmitter();
    this.mockProxyEventEmitter.emit('proxyReq', proxyReq, this.req);
  }

  @test 
  proxyContextIsCreatedOnTheRequestObject() {
    this.req.should.have.property('context');
  }

  @test 
  proxyContextIsCreatedOnTheRequestObjectWithAnEmptyRequestBody() {
    (this.req as any).context.should.have.property('request');    
    (this.req as any).context.request.body.should.equal('');
  }

}


@suite 
class RequestDataEventOccurs extends ProxyTest {

  private req : EventEmitter;

  public before() {
    super.before();
    this.req = new EventEmitter();
    let proxyReq = new EventEmitter();
    this.mockProxyEventEmitter.emit('proxyReq', proxyReq, this.req);
    this.req.emit('data', 'test-data');
  }

  @test 
  public requestBodyIsSetToData() {
    (this.req as any).context.request.body.should.equal('test-data');
  }

  @test 
  dataIsAppendedToRequestBody() {
    this.req.emit('data', '2');
    (this.req as any).context.request.body.should.equal('test-data2');
  }

}


@suite
class RequestEndEventOccurs extends ProxyTest {
  private req : EventEmitter;

  public before() {
    super.before();
    this.req = new EventEmitter();
    let proxyReq = new EventEmitter();       
    //(this.req as any).context = new ProxyContext();
    (this.req as any).url = '/url';
    (this.req as any).headers = {};
    (this.req as any).headers.host = 'host';
    (this.req as any).method = 'get';
    this.mockProxyEventEmitter.emit('proxyReq', proxyReq, this.req);
    this.req.emit('end');
  }

  @test
  requestUrlIsPopulated() {
    (this.req as any).context.request.url.should.equal('/url');
  }

  @test
  requestHostIsPopulated() {
    (this.req as any).context.request.host.should.equal('host');
  }

  @test
  requestProtocolIsPopulated() {
    (this.req as any).context.request.protocol.should.equal('http');
  }

  @test
  requestMethodIsPopulated() {
    (this.req as any).context.request.method.should.equal('get');
  }

  @test
  requestFullUrlIsPopulated() {
    (this.req as any).context.request.fullUrl.should.equal('http://host/url');
  }

  @test
  requestListenerIsCalled() {
    this.mockRequestListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()),TypeMoq.Times.once());
  }
  
}