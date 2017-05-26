import { ProxyContext } from './proxy-context';

export interface ProxyContextPersistor {
  persist(context : ProxyContext);
}