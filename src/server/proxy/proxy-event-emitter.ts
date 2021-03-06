

import * as events from 'events';

export interface ProxyEventEmitter {
  on(eventName : string, callback : Function);
  getRequestListener() : (req, res) => void;
}