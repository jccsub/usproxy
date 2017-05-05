
import { suite, test, slow, timeout } from 'mocha-typescript';
import {HarmonStreamingHtmlMiddleware} from './harmon-streaming-html-middleware';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from '../logger';
import {WinstonLog} from '../winston-logger';

@suite
class CreatedMiddleware {

  private middleware : HarmonStreamingHtmlMiddleware;
  private log : Log;

  before() {
    this.log = new WinstonLog() ;
    this.middleware = new HarmonStreamingHtmlMiddleware(this.log);
  }

  @test
  notEasilyTestable() {
    
  }

}



