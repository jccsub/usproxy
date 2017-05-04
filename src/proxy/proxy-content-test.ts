
import {suite, test} from 'mocha-typescript';
import {ProxyContext} from './proxy-context';
import {should} from 'chai';

@suite 
class ProxyContextIsCreated {

  private proxyContext : ProxyContext;

  before() {
    should();
    this.proxyContext = new ProxyContext();
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
