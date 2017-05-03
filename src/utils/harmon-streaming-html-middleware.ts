import {StreamingHtmlMiddleware,SelectAndReplaceItem} from './streaming-html-middleware';
import harmon = require('harmon');
import {Log} from '../logger';

export class HarmonStreamingHtmlMiddleware implements StreamingHtmlMiddleware {
  private log : Log;

  constructor(log : Log) {
    this.log = log;
    this.selectAndReplaceItems = new Array<SelectAndReplaceItem>();
  }

  public selectAndReplaceItems: Array<SelectAndReplaceItem>;
  
  public get selectAndReplaceCallback(): (req: any, resp: any, next: any) => void {
    let selectAndReplaceParams : any = [];
    this.selectAndReplaceItems.forEach(selectAndReplaceItem=>{
      let item : any = {};
      item.query = selectAndReplaceItem.cssSelector;
      item.func = (node) => {
        node.createWriteStream().end(selectAndReplaceItem.replacementHtml);
      }
      selectAndReplaceParams.push(item);
    });   
    return harmon([],selectAndReplaceParams);
  }

}

