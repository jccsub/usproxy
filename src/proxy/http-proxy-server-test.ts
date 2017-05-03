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

export class ProxyTest {  
  protected mockWebServer : TypeMoq.IMock<WebServer>;
  protected proxyServer : HttpProxyServer;
  protected mockErrorListener : TypeMoq.IMock<ProxyListener>;
  protected mockResponseListener : TypeMoq.IMock<ProxyListener>;
  protected mockProxyEventEmitter : MockProxyEventEmitter;  
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
    this.proxyServer.addErrorListener(this.mockErrorListener.object);   
    this.proxyServer.addResponseListener(this.mockResponseListener.object);
    this.proxyServer.listen(1234);
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