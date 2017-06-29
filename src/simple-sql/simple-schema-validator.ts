import { SimpleColumnDataType, SimpleTableSchema,SimpleColumnAttributes,SimpleColumn } from './simple-schema';
import { Log } from '../logger';
import { guarded, isJson } from '../utils/guards';


export class SimpleSchemaValidator {

  private tableSchema : SimpleTableSchema;
  private log : Log;

  constructor(tableSchema : SimpleTableSchema, log : Log) {
    this.tableSchema = tableSchema;
    this.log = log;
  }
  
  @guarded
  public validate(@isJson data : any) {
    this.tableSchema.forEach((column) => {
      this.validateColumnExistence(data, column)
      if (column.isIdentity()) {
        this.validateNoValueForIdentityColumn(column, data);
        return;
      }      
      switch(column.dataType) {
        case SimpleColumnDataType.int : 
          this.validateIntValue(data[column.columnName]);
          break;        
        case SimpleColumnDataType.string1024:
          this.validateStringValue(data[column.columnName],1024);
          break;        
        case SimpleColumnDataType.string255:
          this.validateStringValue(data[column.columnName],255);
          break;        
        case SimpleColumnDataType.string4096:
          this.validateStringValue(data[column.columnName],4096);
          break;        
        case SimpleColumnDataType.char:
          this.validateStringValue(data[column.columnName],1);
          break;                  
        case SimpleColumnDataType.stringMax:
          this.validateStringValue(data[column.columnName]);
          break;                
        case SimpleColumnDataType.uniqueidentifier:        
          this.validateUuidValue(data[column.columnName]);
          break;
        default: 
          throw new Error(`SimpleSchemaValidator.validate - Unexpected column data type: ${column.dataType}`);
      }     
    });
    return data;
  }

  private validateNoValueForIdentityColumn(column : SimpleColumn,data : any) {
    // tslint:disable-next-line:triple-equals
    if ( column.isPrimaryKey() && (data[column.columnName] != null)) {
      throw new Error(`SimpleSchemaValidator.validateNoValueForIdentityColumn - identity column cannot have a value`)
    }   
  }

  private validateIntValue(value : any) {
    if (!(Number(value) === value && value % 1 === 0)) {
      throw new Error(`SimpleSchemaValidator.validateIntValue - unexpected int value : ${value}`);
    }
  }

  private validateStringValue(value : any, length? : number) {
    // tslint:disable-next-line:triple-equals
    if (value == null) {
      throw new Error(`SimpleSchemaValidator.validateStringValue - expected non-null value`);
    }
    if ((length) && (value.length > length)) {
      throw new Error(`SimpleSchemaValidator.validateStringValue - maximum length is ${length} characters but value is ${value.length} characters for : '${value}'`);
    }
  }

  private validateUuidValue(value : any) {
    var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!pattern.test(value)) {
      throw new Error(`SimpleSchemaValidator.validateUuidValue - unexpected uuid value: ${value}`);
    }
  }

  private validateColumnExistence(data : any, column : SimpleColumn) {
    if (!column.isOptional() && !data.hasOwnProperty(column.columnName)) {
      throw new Error(`SimpleSchemaValidator.validateColumnExistence - required column does not exist in the data: ${column.columnName}`);
    }
  }
  
}