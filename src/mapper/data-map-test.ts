import { WinstonLog } from '../winston-logger';

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from '../logger';
import {DataMap} from './data-map';


@suite
export class DataMapTests {
  private dataMap : DataMap;
  private log : Log;

  before() {
    should();
    this.log = new WinstonLog();
    this.dataMap = new DataMap(this.log);       
  }

  @test
  thisShouldStopCompilingWithFutureReleaseOfTypescript() {
    //datamap.content shouldbe readonly, but that doesn't work
    this.dataMap.content['test'] = 'x'
  }

  @test
  addContentShouldThrowErrorWhenContentIsNull() {
    let errorDetected = false;
    try {
      this.dataMap.addContent(null);
    }
    catch(e) {
      errorDetected = true;
    }
    errorDetected.should.equal(true);

  }

  @test
  addContentShouldThrowErrorWhenContentIsNotJson() {
    let errorDetected = false;
    try {
      this.dataMap.addContent('1');
    }
    catch(e) {
      errorDetected = true;
    }
    errorDetected.should.equal(true);
  }


  @test
  addContentAcceptsJsonString() {
    this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');
  }

  @test
  addContentAcceptsObject() {
    let obj = { prop1 : "val1", prop2 : "val2"  };
    this.dataMap.addContent(obj);
  }

  @test
  addedContentIsAccessible() {
    this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');    
  }

  @test
  toStringReturnsStringRepresentationOfContent() {
    this.dataMap.addContent('{"prop1" : "val1", "prop2" : "val2"}');    
    var x = this.dataMap.toString().should.not.be.empty;
    console.log(this.dataMap.toString());
  }


}