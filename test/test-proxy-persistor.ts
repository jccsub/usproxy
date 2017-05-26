import { ProxyContext } from '../src/proxy/proxy-context';
import { Log } from '../src/logger';

import { ProxyContextPersistor } from "../src/proxy/proxy-context-persistor";

export class TestProxyPersistor implements ProxyContextPersistor {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  persist(context: ProxyContext) {
  }

}