import * as events from 'events';


export interface IEventEmitterCallback<T> {
    ( T ) : void;
}

export interface IProxyEventEmitter<T> {
  addEventListener(listener: IEventEmitterCallback<T>);
  removeEventListener(listener: IEventEmitterCallback<T>);
}


export class ProxyEventEmitter<T> implements IProxyEventEmitter<T> {
  private eventEmitter : events.EventEmitter;
  private eventName : string;

  constructor(eventName : string) {
    this.eventEmitter = new events.EventEmitter();
    this.eventName = eventName;
  }

  public emit(data : T) {
    this.eventEmitter.emit(this.eventName,data);
  }

  public addEventListener(listener: IEventEmitterCallback<T>) {
    this.eventEmitter.on(this.eventName,listener);
  }

  public removeEventListener(listener) {
    this.eventEmitter.removeListener(this.eventName, listener);
  }


}