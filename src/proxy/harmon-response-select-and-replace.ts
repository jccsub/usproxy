import { ResponseSelectAndReplace, SelectAndReplaceItem } from './response-select-and-replace';


export class HarmonResponseSelectAndReplace implements ResponseSelectAndReplace {

  private selectAndReplaceItems : Array<SelectAndReplaceItem>;

  constructor() {
    this.selectAndReplaceItems = new Array<SelectAndReplaceItem>();
  }

  public execute(req: any, res: any) {
    var relevantSelectAndReplaceItems = this.getSelectAndReplaceItemsRelevantToUrl((req as any).url);
    var selects = this.convertSelectAndReplaceToQueryFunctionList(relevantSelectAndReplaceItems);
    var replacer = require('harmon')([],selects);
    replacer(req, res, () => {});
  }

  public addSelectAndReplaceItems(selectAndReplaceItems: Array<SelectAndReplaceItem>) {
    // tslint:disable-next-line:triple-equals
    if (selectAndReplaceItems == null) {
      throw new Error('selectAndReplaceItems must be assigned');
    }
    selectAndReplaceItems = selectAndReplaceItems.concat(selectAndReplaceItems);
  }

  private getSelectAndReplaceItemsRelevantToUrl(url : string) : Array<SelectAndReplaceItem> {
    return this.selectAndReplaceItems.filter((item) => {
       return item.urlPattern.test(url);
    });
  }

  private convertSelectAndReplaceToQueryFunctionList(selectAndReplaceItems : Array<SelectAndReplaceItem>) : any {
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
  


}