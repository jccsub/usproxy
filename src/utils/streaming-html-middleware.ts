
export class SelectAndReplaceItem {
  private selector : string;
  private replacement : string;
  private urlRegEx : RegExp;

  constructor(urlPattern: RegExp, selector : string, replacement : string) {
    this.selector = selector;
    this.replacement = replacement;
    this.urlRegEx = urlPattern;
  }
  public get cssSelector(): string { return this.selector; };
  public get replacementHtml() : string {return this.replacement; }
  public get urlPattern() : RegExp {return this.urlRegEx;}
}

export interface MiddleWareFunction {
  (req: any, resp: any,  next: any) : void;
}

export interface StreamingHtmlMiddleware {
  selectAndReplaceItems : Array<SelectAndReplaceItem>;
  selectAndReplaceCallback : MiddleWareFunction;

}