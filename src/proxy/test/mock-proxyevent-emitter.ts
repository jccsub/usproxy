
import {EventEmitter} from 'events';
import {ProxyEventEmitter} from '../proxy-event-emitter';

export class MockProxyEventEmitter implements ProxyEventEmitter {
  private eventEmitter : EventEmitter;



  constructor() {
    this.eventEmitter = new EventEmitter();
  }


  emit(name : string) : void;
  emit(name : string, arg1 : any) : void;
  emit(name : string, arg1 : any, arg2 : any) : void;
  emit(name : string, arg1 : any, arg2 : any, arg3 : any) : void;


  emit(name : string, arg1? : any, arg2? : any, arg3? : any) : void {
    if (arg3) {
      this.eventEmitter.emit(name, arg1, arg2, arg3);
    }
    else
    if (arg2) {
      this.eventEmitter.emit(name, arg1, arg2);
    }
    if (arg1) {
      this.eventEmitter.emit(name, arg1);
    }
  }


  on(eventName: string, callback: Function) {      
    this.eventEmitter.on(eventName,callback);
  }

  web(req: any, res: any) {   
  }    
}
