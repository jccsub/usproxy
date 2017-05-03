
import { suite, test, slow, timeout } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from '../logger';
import {DataMap} from './data-map';


@suite
export class DataMapToString {
  private dataMap : DataMap;

  before() {
    should();
    this.dataMap = new DataMap();
  }

  @test shouldReturnString() {
    this.dataMap.toString().should.not.be.empty;
  }

}