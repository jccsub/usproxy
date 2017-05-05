
import {EventEmitter} from 'events';
import {ProxyEventEmitter} from '../proxy-event-emitter';

export class MockProxyEventEmitter implements ProxyEventEmitter {
  private eventEmitter : EventEmitter = new EventEmitter();

/* istanbul ignore next */
  constructor() {
  }

  emit(name : string) : void;
  emit(name : string, arg1 : any) : void;
  emit(name : string, arg1 : any, arg2 : any) : void;
  emit(name : string, arg1 : any, arg2 : any, arg3 : any) : void;

/* istanbul ignore next */
  emit(name : string, arg1? : any, arg2? : any, arg3? : any) : void {
    if (arg2) {
      this.eventEmitter.emit(name, arg1, arg2);
    }
    else
    if (arg1) {
      this.eventEmitter.emit(name, arg1);
    }
  }

/* istanbul ignore next */
  on(eventName: string, callback: Function) {      
    this.eventEmitter.on(eventName,callback);
  }
/* istanbul ignore next */
  web(req: any, res: any) {   
  }    
}
