

export class ProxyRequest {
  public body : string;
  public headers : Array<string>;
  public url? : string;
  public protocol? : string;
  public host?: string;
  public get fullUrl() { return `${this.protocol}://${this.host}${this.url}`;}
  public method? : string;
}