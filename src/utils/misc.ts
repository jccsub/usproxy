/*

isJsonValue(value)
generateUuid()
expectException( func : () => void )
stripWhitespaceAndLower(text: string)

*/


export function isJsonValue(value ) {
  try {

    if (value && typeof value === 'object' && value !== null) {
        return true;
    }
    var obj = JSON.parse(value)
    if (obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {}
  return false
}


export function generateUuid() {
      let newid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          // tslint:disable-next-line:triple-equals
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);          
      });      
      return newid;
}

export function expectException( func : () => void ) {
    try {
      func();
    }
    catch(err) {
      return
    }
    throw new Error('Expected exception');
  }

export function stripWhitespaceAndLower(text: string) {
    return text.replace(/\s/g,'').toLowerCase();
}  

export function getCommaIfNeeded(need : boolean) {
    return need ? ',' : '';
  }