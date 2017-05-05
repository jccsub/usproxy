
import { suite, test, slow, timeout } from 'mocha-typescript';
import {SelectAndReplaceItem} from './streaming-html-middleware';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from '../logger';
import {WinstonLog} from '../winston-logger';

@suite
class CreatedSelectAndReplaceItem {  

  private selectAndReplaceItem : SelectAndReplaceItem;
  private log : Log;

  before() {
    this.log = new WinstonLog() ;
    this.selectAndReplaceItem = new SelectAndReplaceItem('selector','replacement');
  }

  @test
  containsASelector() {
    this.selectAndReplaceItem.cssSelector.should.equal('selector');
  }

  @test
  containsAReplacement() {
    this.selectAndReplaceItem.replacementHtml.should.equal('replacement');
  }

}