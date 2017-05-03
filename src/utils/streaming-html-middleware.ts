
export class SelectAndReplaceItem {
  private selector : string;
  private replacement : string;

  constructor(selector : string, replacement : string) {
    this.selector = selector;
    this.replacement = replacement;
  }
  public get cssSelector(): string { return this.selector; };
  public get replacementHtml() : string {return this.replacement; }


}

export interface MiddleWareFunction {
  (req: any, resp: any,  next: any) : void;
}

export interface StreamingHtmlMiddleware {
  selectAndReplaceItems : Array<SelectAndReplaceItem>;
  selectAndReplaceCallback : MiddleWareFunction;
}