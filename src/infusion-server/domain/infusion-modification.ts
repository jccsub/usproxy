
export enum InfusionModificationType {
  Replace,
  Append
}

export interface ModificationQueryFunction {
  query? : string;
  func? : (node:any) => void;
}
export class InfusionModification {

  public readonly newMarkup : string;

  public readonly cssQuery : string;

  public readonly urlPattern : RegExp;

  public readonly modificationType : InfusionModificationType;

  constructor(cssQuery : string, newMarkup : string, modificationType : InfusionModificationType, urlPattern : RegExp) {
    this.newMarkup = newMarkup;
    this.cssQuery = cssQuery;
    this.modificationType = modificationType;
    this.urlPattern = urlPattern;
  }

  public convertToQueryFunction()  : ModificationQueryFunction {
    let select : ModificationQueryFunction = {};
    select.query = this.cssQuery;
    select.func = (node) => {
      if (this.modificationType === InfusionModificationType.Append) {
        this.append(node, this.newMarkup);
      }
      else {
        this.replace(node, this.newMarkup);
      }
    }
    return select;
  }

  
  private replace(node : any, newText : string) {
    node.createWriteStream().end(newText);
  }

  private append(node : any, newMarkup : string) {
    var rs = node.createReadStream();
    var ws = node.createWriteStream({outer: false});

    // Read the node and put it back into our write stream, 
    // but don't end the write stream when the readStream is closed.
    rs.pipe(ws, {end: false});

    // When the read stream has ended, attach our style to the end
    rs.on('end', function(){
      ws.end(newMarkup);});
    
  }
}