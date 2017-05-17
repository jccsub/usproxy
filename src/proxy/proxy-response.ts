/**
 * Contains the response data within a ProxyContext object
 */
export class ProxyResponse {
  public body : string = '';
  public headers : Array<string>;
  public statusCode : string;
}