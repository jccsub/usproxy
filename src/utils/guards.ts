
import {isJsonValue} from './misc';

var guardTypes : Map<string,ParameterValidation> = new Map<string,ParameterValidation>();


/* istanbul ignore next */ 
export function notNull(target: any, key : string, index : number) {
  var metadataKey = `notNull_${key}_parameters`;
  // tslint:disable-next-line:triple-equals
  if (target[metadataKey] == null) {
    target[metadataKey] = [];    
  }
  target[metadataKey].push(index);
}

/* istanbul ignore next */ 
export function isJson(target: any, key : string, index : number) {
  var metadataKey = `isJson_${key}_parameters`;
  // tslint:disable-next-line:triple-equals
  if (target[metadataKey] == null) {
      target[metadataKey] = [];
  }
  target[metadataKey].push(index);
}

/* istanbul ignore next */ 
guardTypes.set('notNull' , (target : Object,key : string,index : number,value : any) => {
    if (value === undefined) {
        throw new Error(`${target.constructor.name}.${key}, value at argument ${index} cannot be undefined`);
    }
    if (value === null) {
        throw new Error(`${target.constructor.name}.${key} expects non null value at argument ${index}, but was found to be ${JSON.stringify(value) || value.toString()}`);
    }
});

/* istanbul ignore next */ 
guardTypes.set('isJson', (target : Object, key : string, index : number, value : any) => {
    // tslint:disable-next-line:triple-equals
    if (value === undefined) {
        throw new Error(`${target.constructor.name}.${key}, JSON value at argument ${index} cannot be undefined`);
    }
    if (!isJsonValue(value)) {
        throw new Error(`${target.constructor.name}.${key} expects json type value at argument ${index}, but was instead = ${JSON.stringify(value) || value.toString()}`);    
    }
});   

/* istanbul ignore next */ 
interface ParameterValidation {
    (target : Object, key : string, index : number, value : any) : void;
}

/* istanbul ignore next */
export function guarded(target : Object, key : string, descriptor: TypedPropertyDescriptor<any>) {
    guardTypes.forEach((validation,guardType) => {
        checkParameterDecorators(guardType, validation, target, key, descriptor);
    } );
}



/* istanbul ignore next */ 
function checkParameterDecorators(guardType: string, validation : ParameterValidation, target : Object, key : string, descriptor : TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value; // save a reference to the original method
    var metadataKey = `${guardType}_${key}_parameters`;

    var indices = target[metadataKey];
    

    // tslint:disable-next-line:triple-equals
    if (indices == null) {
        return;
    }

    var result;
    // NOTE: Do not use arrow syntax here. Use a function expression in 
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function(...args: any[]) {
        if (Array.isArray(indices)) {
            for (var i = 0; i < args.length; i++) {                 
                if (indices.indexOf(i) !== -1) { 
                    validation(target, key, i, args[i]);
                }
            }
            result = originalMethod.apply(this, args);
            return result;
        }
        else {
            var a = args[0];
            validation(target, key, 0, a);           
            result = originalMethod.apply(this, args);
            var r = JSON.stringify(result);
            return result;
        }
    }

}




