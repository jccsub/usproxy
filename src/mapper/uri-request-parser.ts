import { Log } from '../logger';
import { RequestParser } from './request-parser';


export class UriRequestParser implements RequestParser {

  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public parse(requestString : string) : any {
    var query = {};
    var a = (requestString[0] === '?' ? requestString.substr(1) : requestString).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
  }
  
}