
import {HttpProxyProxyServer} from '../httpproxy-proxy-server';
import {should} from 'chai';
import {ProxyEventEmitter} from '../proxy-event-emitter';
import {Log} from '../../logger';
import {ProxyContext} from '../proxy-context';
import {WebServer} from '../../webserver/web-server';
import { suite, test, slow, timeout } from 'mocha-typescript';
import {ProxyListener} from '../proxy-listener';
import {EventEmitter} from 'events';
import * as TypeMoq from 'typemoq';
import {MockProxyEventEmitter} from './mock-proxyevent-emitter';
import {WinstonLog}  from '../../winston-logger';




class ErrorHandlingTest {  
  protected  mockWebServer : TypeMoq.IMock<WebServer>;
  protected  proxyServer : HttpProxyProxyServer;
  protected mockErrorListener : TypeMoq.IMock<ProxyListener>;
  protected  mockProxyEventEmitter : MockProxyEventEmitter;  
  protected  log : Log;

  public before() {    
    this.mockWebServer = TypeMoq.Mock.ofType<WebServer>();
    this.mockProxyEventEmitter = new MockProxyEventEmitter();
    this.log = new WinstonLog();
    this.proxyServer = new HttpProxyProxyServer(this.mockProxyEventEmitter,this.mockWebServer.object, this.log);    
    this.mockErrorListener = TypeMoq.Mock.ofType<ProxyListener>();
    this.proxyServer.addErrorListener(this.mockErrorListener.object);
    this.proxyServer.listen(1234);
    should();
  }


}

@suite
class ErrorEmittedBeforeARequestIsMade extends ErrorHandlingTest{
 
  //@test
  public shouldCallHandleEventOnce() {
    let e = new Error('Again');
    this.mockProxyEventEmitter.emit('error',e);
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAny()),TypeMoq.Times.once());
  }


  //@test
  public shouldCallHandleEventWithTheEmittedErrorObject() {
    let e = new Error('Again');
    this.mockProxyEventEmitter.emit('error',new Error('Just testing'));
    this.mockErrorListener.verify(x=>x.handleEvent(TypeMoq.It.isAny(),TypeMoq.It.isAnyObject(Error)),TypeMoq.Times.once());
  }

  
}

@suite
class ErrorEmittedAfterARequestIsMade extends ErrorHandlingTest {

  //@test
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