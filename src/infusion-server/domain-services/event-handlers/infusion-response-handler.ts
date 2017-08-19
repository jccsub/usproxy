import { Log } from '../../../logger';


export class InfusionResponseHandler {

  log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public onData(chunk : any) {
    this.log.debug(`InfusionResponseHandler.onData`);
  }

  public onEnd() {
    this.log.debug(`InfusionResponseHandler.onEnd`);
  }

}