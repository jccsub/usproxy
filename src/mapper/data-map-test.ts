import { WinstonLog } from '../winston-logger';

import { suite, test, slow, timeout } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from '../logger';
import {DataMap} from './data-map';


@suite
export class DataMapToString {
  private dataMap : DataMap;

  private log : Log;

  before() {
    should();
  }

  @test shouldReturnString() {
  }

}