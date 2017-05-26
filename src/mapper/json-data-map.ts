import { DataMap } from './data-map';
import { Log } from '../logger';


export class JsonDataMap implements DataMap{  
  log : Log;
  filters : any;

  public readonly content : any = {};

  constructor(log : Log) {
    this.log = log;
  }

  public toString() {
    let value : string;
    value = '{';

    for(var key in this.content) {
      value += `\n\t${key} : ${this.content[key]},`;
    }    
    value += '\n}';
    return value;
  }

  public addContent(jsonContent : any) {
    for (var key in jsonContent){
      this.content[key] = jsonContent[key];
    }
  }

}