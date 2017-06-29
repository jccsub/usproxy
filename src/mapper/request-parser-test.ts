import { Log } from '../logger';
import { ProxyContext } from '../proxy/proxy-context';
import { WinstonLog } from '../winston-logger';
import { DataMapper } from './data-mapper';
import { RequestParser } from './request-parser';
import { should } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';




@suite
class RequestParserTest {
  protected requestParser : RequestParser;
  protected log : Log;
  protected context : ProxyContext;

  protected underTest : RequestParser;
  before() {    
    should();
    this.log = new WinstonLog();
    this.requestParser = new RequestParser(this.log);
  }


  @test
  requestParserIsCreated() {

  }

  @test
  parsingEmptyStringDoesNotThrowException() {
    this.requestParser.parse('');
  }

  @test
  queryStringWithOneParameterIsParsed() {
    let queryString = '?param1=val1'
    let result : any = this.requestParser.parse(queryString);
    result.param1.should.equal('val1');
  }

  @test
  queryStringWithMultipleParametersIsParsed() {
    let queryString = '?param1=val1&param2=val2'
    let result : any = this.requestParser.parse(queryString);
    result.param1.should.equal('val1');
    result.param2.should.equal('val2');
  }



}