

import { guarded, isJson } from '../utils/guards';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';
import { Log } from '../logger';
import { getCommaIfNeeded } from '../utils/misc';
import { SimpleSqlSchemaValidator } from './simple-sql-schema-validator';

export class SimpleSqlTableGenerator {

  private tableName : string;
  private tableSchema : SimpleTableSchema;
  private log : Log;
  private validator : SimpleSqlSchemaValidator;

  constructor(tableName : string, tableSchema : SimpleTableSchema, sqlValidator : SimpleSqlSchemaValidator, log : Log) {
    this.tableName = tableName;
    this.tableSchema = tableSchema;
    this.log = log;
    this.validator = sqlValidator;
  }

  public generateCreateTableIfItDoesNotExist() {
    var sqlStatement = `if not exists(select * from sysobjects where name='${this.tableName}' and xtype='U') `;
    sqlStatement += `create table ${this.tableName} ( `;
    let first = true;
    this.tableSchema.forEach((column) => {
      console.log(column.columnName);
      sqlStatement += getCommaIfNeeded(!first);
      first = false;
      sqlStatement += this.generateColumnDefinition(column);      
    });
    sqlStatement += this.generatePrimaryKeyConstraint();
    sqlStatement += `)`;
    
    return sqlStatement;
  }  

  private generatePrimaryKeyConstraint() {
    let first = true;
    let list = '';
    this.tableSchema.forEach((column) => {
      if (column.isPrimaryKey()) {
        list += getCommaIfNeeded(!first);
        first = false;
        list += column.columnName;
      }
    }); 
    return ` primary key (${list})`;
  }

  private generateColumnDefinition(column : SimpleColumn) : string {
    let def = `${column.columnName} `;
    switch(column.dataType) {
      case SimpleColumnDataType.int : { def += 'int '; break;}
      case SimpleColumnDataType.char : { def += 'char(1) '; break;}      
      case SimpleColumnDataType.string1024 : { def += 'varchar(1024) '; break;}
      case SimpleColumnDataType.string255 : { def += 'varchar(255) '; break;}
      case SimpleColumnDataType.string4096 : { def += 'varchar(4096) '; break;}      
      case SimpleColumnDataType.stringMax : { def += 'varchar(MAX) '; break;}
      case SimpleColumnDataType.uniqueidentifier : { def += 'uniqueidentifier '; break;}      
      default : { throw new Error(`SimpleSqlGenerator.getColumnDefinition() - Not a valid data type for ${def} : ${column.dataType}`) }
    }

    if (column.isIdentity()) {
      switch (column.dataType) {
        case SimpleColumnDataType.int : { def += 'identity(1,1) '; break;}
        case SimpleColumnDataType.uniqueidentifier : { def += 'default newid() '; break;}
        default: { throw new Error(`SimpleSqlGenerator.getColumnDefinition() - Identity must be either an int or uniqueidentifier: ${def}`) }
      }
    }
    if (!column.isOptional() && (!(column.isIdentity() && (column.dataType === SimpleColumnDataType.uniqueidentifier))) ) {
      def += 'not null '
    }
    return def;

  }

}