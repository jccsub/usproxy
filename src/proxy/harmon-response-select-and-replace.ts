import { Log } from '../logger';
import {
  ResponseSelectAndReplace,
  ResponseSelectAndReplaceFactory,
  SelectAndReplaceItem
} from './response-select-and-replace';

export class HarmonResponseSelectAndReplaceFactory implements ResponseSelectAndReplaceFactory {
  public create(log: Log) : ResponseSelectAndReplace {
    return new HarmonResponseSelectAndReplace(log);
  }
}

export class HarmonResponseSelectAndReplace implements ResponseSelectAndReplace {

  private log : Log;

  private selectAndReplaceItems : Array<SelectAndReplaceItem>;

  constructor(log : Log) {
    this.log = log;
    this.selectAndReplaceItems = new Array<SelectAndReplaceItem>();
  }

  public execute(req: any, res: any) {
    this.log.debug('execute()');
    var selects = this.convertSelectAndReplaceToQueryFunctionList(this.selectAndReplaceItems);            
    this.log.debug(`execute() selects list count = ${selects.length}`);
    var replacer = require('harmon')([],selects);
    replacer(req, res, () => {});
  }

  public addSelectAndReplaceItems(selectAndReplaceItems: Array<SelectAndReplaceItem>) {
    this.log.debug(`addSelectAndReplaceItems called - ${selectAndReplaceItems.length} items`);
    // tslint:disable-next-line:triple-equals
    if (selectAndReplaceItems == null) {
      throw new Error('selectAndReplaceItems must be assigned');
    }    
    this.selectAndReplaceItems = this.selectAndReplaceItems.concat(selectAndReplaceItems);
  }


  private convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems : Array<SelectAndReplaceItem>) : any {
    this.log.debug(`convertSelectAndReplaceToQueryFunctionList called with ${selectAndReplaceItems.length} items`);
    let selects : any = [];
    selectAndReplaceItems.forEach((item) => {


      let singleSelect : any = {};
      (singleSelect as any).query = item.select;
      (singleSelect as any).func = (node) => {
        
        var out = item.replace;
        var rs = node.createReadStream();
        var ws = node.createWriteStream({outer: false});

        // Read the node and put it back into our write stream, 
        // but don't end the write stream when the readStream is closed.
        rs.pipe(ws, {end: false});

        // When the read stream has ended, attach our style to the end
        rs.on('end', function(){
        ws.end(out);
        });
      }
      selects.push(singleSelect);
    });
    return selects;
  }
  


/*
  private convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems : Array<SelectAndReplaceItem>) : any {
    this.log.debug(`convertSelectAndReplaceToQueryFunctionList called with ${selectAndReplaceItems.length} items`);
    let selects : any = [];
    selectAndReplaceItems.forEach((item) => {
      let singleSelect : any = {};
      (singleSelect as any).query = item.select;
      (singleSelect as any).func = (node) => {
        
        node.createWriteStream().end(item.replace);
      }
      selects.push(singleSelect);
    });
    return selects;
  }
  
*/

}