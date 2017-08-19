import { Log } from '../../../logger';


export class InfusionPathRewriteHandler {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }

  public handle(path : string, req : any) {
    this.log.debug(`InfusionPathRewriteHandler.handle`);
  }

}