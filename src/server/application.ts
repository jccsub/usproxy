
import {IncomingMessage, ServerResponse} from 'http';

export interface Application {
  requestListener: (request: IncomingMessage, response: ServerResponse) => void;
  use(callback : Function);  
}