
import { suite, test, slow, timeout } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';
import {should} from 'chai';
import {Log} from './logger';
import {WinstonLog} from './winston-logger';


@suite
export class CreatedWinstonLogger  {
  private logger : Log;

  before() {
    should();
    this.logger = new WinstonLog();
  }

  @test settingLevelToInfoShouldPersistValue() {
    this.logger.level = 'info';
    this.logger.level.should.equal('info');
  }

  @test settingLevelToDebugShouldPersistValue() {
    this.logger.level = 'debug';
    this.logger.level.should.equal('debug');
  }

  @test settingLevelToErrorShouldPersistValue() {
    this.logger.level = 'error';
    this.logger.level.should.equal('error');
  }

@test settingLevelToWarnShouldPersistValue() {
    this.logger.level = 'warn';
    this.logger.level.should.equal('warn');
  }

@test warnLogsAWarningMessage() {
  this.logger.warn('message');
}

@test debugLogsADebugMessage() {
  this.logger.debug('message');
}

@test errorLogsAnErrorMessage() {
  this.logger.error('test');
}

@test infoLogsAnInfoMessage() {
  this.logger.info('test');
}
  

  

}