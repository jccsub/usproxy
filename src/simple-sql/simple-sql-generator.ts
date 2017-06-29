import { guarded, isJson } from '../utils/guards';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';



export class SimpleSqlGenerator {

  private tableName : string;
  private tableSchema : SimpleTableSchema;
  private databaseName : string;
  constructor(databaseName : string, tableName : string, tableSchema : SimpleTableSchema) {
    this.tableName = tableName;
    this.tableSchema = tableSchema;
    this.databaseName = databaseName;
  }

  @guarded
  public generateInsertStatement(@isJson data : any) {
    let insert = `insert into ${this.tableName} (`;
    let first = true;
    this.tableSchema.forEach((column) => {
      if (first && !this.isIdentity(column))  {first = false} else {insert += ','}      
      if (!this.isIdentity(column)) {
        insert += `[${column.columnName}]`      
      }
    });
    first = true;
    insert += `) VALUES (`;
    this.tableSchema.forEach((column) => {
      if (first && !this.isIdentity(column)) {first = false} else {insert += ','}
      if (!this.isIdentity(column)) {
        insert += (column.dataType !== SimpleColumnDataType.int ) ? `'${data[column.columnName]}'` : `${data[column.columnName]}`;      
      }
    });
    insert += `)`
    return insert;
  }

  public generateCreateDatabaseIfItDoesNotExist() {
    let sqlStatement = `if not exists(select * from sys.databases where name = '${this.databaseName}') `;
    sqlStatement += `create database ${this.databaseName}`;    
    return sqlStatement;
  }


  public generateCreateTableIfItDoesNotExist() {
    var sqlStatement = `if not exists(select * from sysobjects where name='${this.tableName}' and xtype='U') `;
    sqlStatement += `create table ${this.tableName} ( `;
    let first = true;
    this.tableSchema.forEach((column) => {
      let columnDef = '';
      if (first) { first = false } else { columnDef += ', ' }
      columnDef = column.getDefinition();
    });
    sqlStatement += `)`;
    return sqlStatement;
  }  

  private isIdentity(column : SimpleColumn) {
    return column.attributes && SimpleColumnAttributes.identity;
  }
}