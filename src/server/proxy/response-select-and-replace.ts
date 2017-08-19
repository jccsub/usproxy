import { Log } from '../../logger';

export enum SelectAndReplaceType {
  Replace,
  Append
}

export class SelectAndReplaceItem {
  public readonly newText: string;
  public readonly select: string;

  public readonly changeType : SelectAndReplaceType;

  constructor(select: string, replace: string, changeType : SelectAndReplaceType) {
    this.select = select;
    this.newText = replace;
    this.changeType = changeType;
  }

}

export interface ResponseSelectAndReplace {
  
  execute(req: any, res: any);

  addSelectAndReplaceItems(selectAndReplaceItems : Array<SelectAndReplaceItem>);

}

export interface ResponseSelectAndReplaceFactory {
  create(log : Log) : ResponseSelectAndReplace;
}