import { Log } from '../../logger';
import { MockDataMap } from './mock-datamap';
import { DataMap } from '../../mapper/data-map';
import { SelectAndReplaceItem } from '../response-select-and-replace';
import { ProxyRequest } from '../proxy-request';
import { ProxyResponse } from '../proxy-response';
import { ProxyContext } from '../proxy-context';

export class MockProxyContext implements ProxyContext {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  public response: ProxyResponse = new ProxyResponse();
  public request: ProxyRequest = new ProxyRequest();
  public selectAndReplaceItems: Array<SelectAndReplaceItem> = new Array<SelectAndReplaceItem>();
  public rewritePath: string = '';
  public error: Error;
  public dataMap: DataMap = new MockDataMap();
  

  public toString() {
    console.log('MockProxyContext.toString()');
  }
}