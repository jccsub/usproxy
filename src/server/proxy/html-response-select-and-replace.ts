import { guarded, notNull } from '../../utils/guards';
import { Log } from '../../logger';
import {
  SelectAndReplaceType,
  SelectAndReplaceItem,
  ResponseSelectAndReplace,
  ResponseSelectAndReplaceFactory
} from './response-select-and-replace';


export class HtmlResponseSelectAndReplace implements ResponseSelectAndReplace {

  private log : Log;

  private selectAndReplaceItems : Array<SelectAndReplaceItem>;

  private replacerFactory : (reqSelects : any, resSelects : any) => (req, res, func) => void;

  constructor(replacerFactory : (reqSelects : any, resSelects: any)=>(req, res, func) => void, log : Log) {
    this.log = log;
    this.selectAndReplaceItems = new Array<SelectAndReplaceItem>();
    this.replacerFactory = replacerFactory;
  }

  @guarded
  public execute(@notNull req: any, @notNull res: any) {
    var selects = this.convertSelectAndReplaceToQueryFunctionList(this.selectAndReplaceItems);            
    var replacer = this.replacerFactory([],selects);
    replacer(req, res, () => {});
  }

  public addSelectAndReplaceItems(selectAndReplaceItems: Array<SelectAndReplaceItem>) {
    this.selectAndReplaceItems = this.selectAndReplaceItems.concat(selectAndReplaceItems);
  }

/* istanbul ignore next */
  private convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems : Array<SelectAndReplaceItem>) : any {
    let selects : any = [];
    selectAndReplaceItems.forEach((item) => {
      let singleSelect : any = {};
      (singleSelect as any).query = item.select;
      (singleSelect as any).func = (node) => {
        if (item.changeType === SelectAndReplaceType.Append) {
          this.append(node, item.newText);
        }        
        else {
          this.replace(node, item.newText);
        }
      }
      selects.push(singleSelect);
    });
    return selects;
  }
  

/* istanbul ignore next */
  private replace(node : any, newText : string) {
    node.createWriteStream().end(newText);
  }


/* istanbul ignore next */
  private append(node: any, newText : string) {
    var rs = node.createReadStream();
    var ws = node.createWriteStream({outer: false});

    // Read the node and put it back into our write stream, 
    // but don't end the write stream when the readStream is closed.
    rs.pipe(ws, {end: false});

    // When the read stream has ended, attach our style to the end
    rs.on('end', function(){
      ws.end(newText);});

  }

}

export class HtmlResponseSelectAndReplaceFactory implements ResponseSelectAndReplaceFactory {
/* istanbul ignore next */
  public create(log: Log): ResponseSelectAndReplace {
    return new HtmlResponseSelectAndReplace(require('harmon'),log);
  }
}
