import { Log } from '../logger';


export class SelectAndReplaceItem {
  public readonly replace: string;
  public readonly select: string;
  constructor(select: string, replace: string) {
    this.select = select;
    this.replace = replace;
  }

}

export interface ResponseSelectAndReplace {
  
  execute(req: any, res: any);

  addSelectAndReplaceItems(selectAndReplaceItems : Array<SelectAndReplaceItem>);

}

export interface ResponseSelectAndReplaceFactory {
  create(log : Log) : ResponseSelectAndReplace;
}