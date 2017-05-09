
import * as http from 'http';
import {Log} from '../logger';
import {WebServer} from './web-server';

export class HttpWebserver implements WebServer {

  startServer(port: number,callback: (request: http.IncomingMessage, response: http.ServerResponse) => void) {
    http.createServer(callback).listen(port);
  }
}