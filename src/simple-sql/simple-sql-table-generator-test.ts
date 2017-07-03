
import { Log } from '../logger';
import { expectException, stripWhitespaceAndLower } from '../utils/misc';
import { WinstonLog } from '../winston-logger';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';
import { SimpleSqlSchemaValidator } from './simple-sql-schema-validator';
import { SimpleSqlTableGenerator } from './simple-sql-table-generator';
import { SimpleTestSchemaBuilder } from './simple-test-schema-builder';
import {should,expect} from 'chai';
import { suite, test, slow, timeout } from 'mocha-typescript';


@suite
export class SimpleSqlTableGeneratorTest {

  private generator : SimpleSqlTableGenerator;
  private tableSchema : SimpleTableSchema;
  private validator : SimpleSqlSchemaValidator;
  private log : Log;

  before() {
    this.tableSchema = SimpleTestSchemaBuilder.buildSchema();
    this.log = new WinstonLog();
    this.validator = new SimpleSqlSchemaValidator(this.tableSchema, this.log);
    this.generator = new SimpleSqlTableGenerator('test', this.tableSchema, this.validator, this.log);
  }

  @test
  tableGeneratorDoesGenerateTable() {
    let sql = this.generator.generateCreateTableIfItDoesNotExist();
    let expected = `if not exists(select * from sysobjects where name='test' and xtype='U') ` +
                    `create table test ( id int identity(1,1) not null ,name varchar(255) not null ,` + 
                    `description varchar(1024) not null ,optionalInt int ,max varchar(MAX) not null , ` +
                    `bigString varchar(4096) not null ,yesNo char(1) not null ,uuid uniqueidentifier not null  primary key (id))`;
    expected = stripWhitespaceAndLower(expected);
    stripWhitespaceAndLower(sql).should.equal(expected);
  }

  @test
  tableGeneratorCanIncludeCompositePrimaryKey() {
    this.tableSchema.forEach((column) => { if (column.columnName === 'name') {column.attributes = SimpleColumnAttributes.primaryKey}});
    let sql = this.generator.generateCreateTableIfItDoesNotExist();
    let expected = `if not exists(select * from sysobjects where name='test' and xtype='U') ` +
                    `create table test ( id int identity(1,1) not null ,name varchar(255) not null ,` + 
                    `description varchar(1024) not null ,optionalInt int ,max varchar(MAX) not null , ` +
                    `bigString varchar(4096) not null ,yesNo char(1) not null ,uuid uniqueidentifier not null  primary key (id,name))`;
    expected = stripWhitespaceAndLower(expected);
    stripWhitespaceAndLower(sql).should.equal(expected);
  }


}
