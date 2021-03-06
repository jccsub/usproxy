

export class InfusionRequest {
  public body : string;
  public headers : Map<string,string>;
  public url : string;
  public protocol : string;
  public host: string;
  public get fullUrl() { return `${this.protocol}://${this.host}${this.url}`;}
  public method : string;  
  public sessionId : string;
}