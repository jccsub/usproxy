import { Log } from '../../../logger';

export class InfusionErrorHandler {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  public handle(err : any, req : any, res : any) {
    this.log.debug(`InfusionErrorHandler.handle`);
  }

}