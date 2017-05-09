
import {IncomingMessage, ServerResponse} from 'http';
import {Application} from './application';


export interface WebServer{
  startServer( port : number, callback : (req? , res?) => void);
}