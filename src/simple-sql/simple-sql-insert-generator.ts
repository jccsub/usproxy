import { guarded, isJson } from '../utils/guards';
import { SimpleColumnDataType, SimpleTableSchema, SimpleColumn } from './simple-schema';
import { SimpleSqlDataValidator } from './simple-sql-data-validator';
import { Log } from "../logger";
import { getCommaIfNeeded } from "../utils/misc";


export class SimpleSqlInsertGenerator {

  private tableName : string;
  private tableSchema : SimpleTableSchema
  private log : Log;
  private validator : SimpleSqlDataValidator;

  constructor(tableName : string, tableSchema : SimpleTableSchema, validator : SimpleSqlDataValidator, log : Log) {
    this.tableName = tableName;
    this.tableSchema = tableSchema;
    this.validator = validator;
    this.log = log;
  }

  @guarded
  public generateInsertStatement(@isJson data : any) {
    this.validator.validate(data);
    return this.generateInsertColumnsPart(data) + this.generateInsertValuesPart(data);
  }

  private generateInsertColumnsPart(data : any) : string {
    let insert = `insert into [${this.tableName}] (`;
    let first = true;
    this.tableSchema.forEach((column) => {
      let columnUsed = this.columnIsUsedInInsert(column, data);
      insert += getCommaIfNeeded(!first && columnUsed);
      if (columnUsed) {
        first = false;
        insert += `[${column.columnName}]`              
      }
    });
    insert += ')';
    return insert;
  }

  private generateInsertValuesPart(data : any) : string {
    let insert = ` values (`;
    let first = true;
    this.tableSchema.forEach((column) => {
      let columnUsed = this.columnIsUsedInInsert(column, data);
      insert += getCommaIfNeeded(!first && columnUsed);
      if (columnUsed) {
        first = false;
        insert += (column.dataType !== SimpleColumnDataType.int ) ? `'${data[column.columnName]}'` : `${data[column.columnName]}`;
      }
    });
    insert += ')';
    return insert;
  }


  private columnIsUsedInInsert(column : SimpleColumn, data : any) : boolean {
    return !column.isIdentity() && (data[column.columnName] !== undefined);
  }  
}