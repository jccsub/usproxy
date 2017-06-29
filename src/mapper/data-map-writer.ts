import { DataMap } from './data-map';
import { guarded, isJson } from '../utils/guards';
import { Log } from '../logger';
import { DataWriter } from '../db/data-writer';

export class DataMapWriter {

  private dataWriter : DataWriter;
  private log : Log;

  constructor(dataWriter : DataWriter, log : Log) {
    this.dataWriter = dataWriter;
    this.log = log;
  }

 @guarded
  public write( dataMapToWrite : DataMap) {
    this.dataWriter.write(dataMapToWrite);
  }

}