import { guarded, isJson, notNull } from '../utils/guards';
import { Log } from '../logger';


export class DataMap {  
  log : Log;
  filters : any;

  public content : ReadonlyMap<string,string> = new Map<string,string>();

  
  constructor(log : Log) {
    // tslint:disable-next-line:triple-equals
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

  @guarded
  public addContent(@isJson jsonContent : any) {
    var content;
    if (jsonContent && typeof jsonContent === 'object' && jsonContent !== null) {
      content = jsonContent;
    }
    else {
      content = JSON.parse(jsonContent);
    }
    for (var key in content){
      this.content[key] = jsonContent[key];
    }
  }


}