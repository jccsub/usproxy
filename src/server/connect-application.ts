

import {Application} from './application';
import {IncomingMessage, ServerResponse} from 'http';
import * as connect from 'connect';

export class ConnectApplication implements Application {
  private app : any;

  constructor() {
    this.app = connect();
  }

  get requestListener(): (request: IncomingMessage, response: ServerResponse) => void {
    return (this.app as (request: IncomingMessage, response: ServerResponse) => void);
  }

  use(callback: Function) {
    this.app.use(callback);
  }


}