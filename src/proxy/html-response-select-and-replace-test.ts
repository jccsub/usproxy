import {
  ResponseSelectAndReplace,
  ResponseSelectAndReplaceFactory,
  SelectAndReplaceItem,
  SelectAndReplaceType
} from './response-select-and-replace';
import { HtmlResponseSelectAndReplace } from './html-response-select-and-replace';
import { Log } from '../logger';
import { ProxyContext } from '../proxy/proxy-context';
import { WinstonLog } from '../winston-logger';
import { should } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';



@suite
class HtmlResponseSelectAndReplaceTest {
  protected log : Log;
  protected context : ProxyContext;
  protected underTest : HtmlResponseSelectAndReplace;
  protected requestSelects : any;
  protected responseSelects : any;
  protected currentReq : any;
  protected currentRes : any
  protected currentFunc : Function;

  protected executeRequest : any;
  protected executeResponse : any;
  before() {    
    should();
    this.log = new WinstonLog();
    this.underTest = new HtmlResponseSelectAndReplace(this.replacerFactory(),this.log);
    this.executeRequest = {};
    this.executeResponse = {};
  }

  @test
  objectCreated() { }

  replacerFactory() {
    return (reqSelects,resSelects) => {
      this.requestSelects = reqSelects;
      this.responseSelects = resSelects;
      return (req, res, func) => {
        this.currentReq = req;
        this.currentRes = res;
        this.currentFunc = func;
      }
    }
  }

}

@suite
class HtmlResponseSelectAndReplaceExecuteTest extends HtmlResponseSelectAndReplaceTest {

  @test
  public throwsExceptionIfReqIsNull() {
    let exceptionThrown = false;
    try {
      this.underTest.execute(null, {});
    }
    catch(e) {
      exceptionThrown = true;
    }
    exceptionThrown.should.equal(true);
  }

    @test
  public throwsExceptionIfResIsNull() {
    let exceptionThrown = false;
    try {
      this.underTest.execute({}, null);
    }
    catch(e) {
      exceptionThrown = true;
    }
    exceptionThrown.should.equal(true);
  }

  @test
  public replacerFactoryIsCalledWithNoRequestModifications() {
    this.underTest.execute(this.executeRequest, this.executeResponse);
    var x = this.requestSelects.should.be.empty;
  }

  

  @test
  public replacerIsCalledWithExpectedRequest() {
    this.executeRequest.text = 'test';
    this.underTest.execute(this.executeRequest, this.executeResponse);
    this.currentReq.text.should.equal('test');
  }

  @test
  public replacerIsCalledWithExpectedResponse() {
    this.executeResponse.text = 'test';
    this.underTest.execute(this.executeRequest, this.executeResponse);
    this.currentRes.text.should.equal('test');
  }


}

@suite
class HtmlResponseSelectAndReplaceAddSelectAndReplaceItemsTest extends HtmlResponseSelectAndReplaceTest {

  @test
  emptySelectAndReplaceArrayDoesNotThrowException() {
    this.underTest.addSelectAndReplaceItems([]);
  }

  @test
  appendSelectAndReplaceItemIsProcessedWhenExecuteIsCalled() {
    let appendItem = new SelectAndReplaceItem('.b','<h1>test</h1>',SelectAndReplaceType.Append);
    this.underTest.addSelectAndReplaceItems([appendItem]);
    this.underTest.execute(this.executeRequest, this.executeResponse);
    this.responseSelects[0].query.should.equal('.b');
  }

  @test
  replaceSelectAndReplaceItemIsProcessedWhenExecuteIsCalled() {
    let replaceItem = new SelectAndReplaceItem('.b','<h1>test</h1>',SelectAndReplaceType.Replace);
    this.underTest.addSelectAndReplaceItems([replaceItem]);
    this.underTest.execute(this.executeRequest, this.executeResponse);
    this.responseSelects[0].query.should.equal('.b');
  }
}