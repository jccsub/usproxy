
import * as http from 'http';
import * as connect from 'connect';

export interface WebServer {
  use(callback : Function);
  listen(port : number);
}