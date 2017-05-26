import { Log } from '../logger';

export enum HtmlChangeType {
  Replace,
  Append
}

export class HtmlModification {
  public readonly newText: string;
  public readonly select: string;

  public readonly changeType : HtmlChangeType;

  constructor(select: string, replace: string, changeType : HtmlChangeType) {
    this.select = select;
    this.newText = replace;
    this.changeType = changeType;
  }

}

export interface ResponseSelectAndReplace {
  
  execute(req: any, res: any);

  addSelectAndReplaceItems(selectAndReplaceItems : Array<HtmlModification>);

}

export interface ResponseSelectAndReplaceFactory {
  create(log : Log) : ResponseSelectAndReplace;
}