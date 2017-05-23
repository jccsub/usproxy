

export class SelectAndReplaceItem {
  public readonly replace: string;
  public readonly select: string;
  public readonly urlPattern: RegExp;
  constructor(urlPattern: RegExp, select: string, replace: string) {
    // tslint:disable-next-line:triple-equals
    if (urlPattern == null) {
      throw new Error('urlPattern cannot be null');
    }
    this.urlPattern = urlPattern;
    this.select = select;
    this.replace = replace;
  }

}

export interface ResponseSelectAndReplace {
  
  execute(req: any, res: any);

  addSelectAndReplaceItems(selectAndReplaceItems : Array<SelectAndReplaceItem>);

}