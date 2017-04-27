
import {WebServer} from './web-server';
import * as http from 'http';
import {Log} from '../logger';

export class ConnectWebServer implements WebServer {

  private app : any;

  constructor(logger : Log) {
    this.app = require('connect')();
    this.app.use((req,res,next)=>{
      logger.debug('ConnectWebServer - logging middleware')
      next()
    });
  }


  use(callback: Function) {
    this.app.use(callback);
  }

  listen(port: number) {
    http.createServer(this.app).listen(port);
  }

}