import { MockProxyContext } from './mocks/mock-proxy-context';
import { WinstonLog } from '../winston-logger';
import { Log } from '../logger';

import {suite, test} from 'mocha-typescript';
import {ProxyContext} from './proxy-context';
import {should} from 'chai';

@suite 
class ProxyContextIsCreated {

  private proxyContext : ProxyContext;
  private log : Log;

  before() {
    should();
    this.log = new WinstonLog();
    this.proxyContext = new MockProxyContext(this.log);
  }

  @test responsePropertyShouldBeInitialized() {    
    this.proxyContext.response.should.not.be.null;
  }

  @test requestPropertyShouldBeInitialized() {
    this.proxyContext.request.should.not.be.null;
  }

  @test dataMapShouldBeInitialized() {
    this.proxyContext.request.should.not.be.null;
  }

}
