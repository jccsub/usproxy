
import {WebServer} from './web-server';
import * as http from 'http';
import {Log} from '../logger';

export class ConnectWebServer implements WebServer {

  private app : any;

/* istanbul ignore next */
  constructor(logger : Log) {
    this.app = require('connect')();
    this.app.use((req,res,next)=>{
      next()
    });
  }

/* istanbul ignore next */
  use(callback: Function) {
    this.app.use(callback);
  }

/* istanbul ignore next */
  listen(port: number) {
    http.createServer(this.app).listen(port);
  }

}