
export class SelectAndReplaceItem {
  public cssSelector : string;
  public replacementHtml : string;
}

export interface StreamingHtmlMiddleware {
  getSelectAndReplaceCallback(selectAndReplaceItems : Array<SelectAndReplaceItem>) : (req,resp,next) => void;
}