import {StreamingHtmlMiddleware,SelectAndReplaceItem} from './streaming-html-middleware';
import harmon = require('harmon');

export class HarmonStreamingHtmlMiddleware implements StreamingHtmlMiddleware {
  getSelectAndReplaceCallback(selectAndReplaceItems: Array<SelectAndReplaceItem>): (req: any, resp: any, next: any) => void {
    let selectAndReplaceParams : any = [];
    selectAndReplaceItems.forEach(selectAndReplaceItem=>{
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

