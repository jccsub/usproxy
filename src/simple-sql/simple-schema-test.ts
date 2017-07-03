import { WinstonLog } from '../winston-logger';
import { Log } from '../logger';
import { expectException } from '../utils/misc';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';
import { SimpleSqlSchemaValidator } from './simple-sql-schema-validator';
import { SimpleSqlConfiguration } from './simple-sql-configuration';
import { SimpleSqlDataConnection } from './simple-sql-data-connection';
import { SimpleTestSchemaBuilder } from './simple-test-schema-builder';
import { suite, test, slow, timeout } from 'mocha-typescript';
import {should,expect} from 'chai';


@suite
class SimpleColumnTest {

  private log : Log;
  private column : SimpleColumn;

  before() {
    this.log = new WinstonLog();    
  }

  @test
  columnCannotBeOptionalAndPrimaryKey() {
    expectException(() => {let column = new SimpleColumn('test',SimpleColumnDataType.int, SimpleColumnAttributes.optional | SimpleColumnAttributes.primaryKey)});
  }

  @test
  columnCannotBeOptionalAndIdentity() {
    expectException(() => {let column = new SimpleColumn('test',SimpleColumnDataType.int, SimpleColumnAttributes.optional | SimpleColumnAttributes.identity)});
  }

  @test
  isIdentityReturnsTrueForIdentityColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'id');
    var x = expect(definition.isIdentity()).to.be.true;
  }

  @test
  isIdentityReturnsFalseForNonIdentityColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'name');
    var x = expect(definition.isIdentity()).to.be.false;
  }

  @test
  isPrimaryKeyReturnsFalseForNonPrimaryKeyColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'name');
    var x = expect(definition.isPrimaryKey()).to.be.false;
  }

  @test
  isPrimaryKeyReturnsTrueForPrimaryKeyColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'id');
    var x = expect(definition.isPrimaryKey()).to.be.true;
  }

  @test
  isOptionalReturnsTrueForOptionalColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'optionalInt');
    var x = expect(definition.isOptional()).to.be.true;
  }

  @test
  isOptionalReturnsFalseForNonOptionalColumn() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let definition = this.findColumnByName(schema, 'name');
    var x = expect(definition.isOptional()).to.be.false;
  }



  
  findColumnByName(schemaToSearch : SimpleTableSchema, columnName : string) : SimpleColumn {
    let foundColumn = new SimpleColumn('notfound',SimpleColumnDataType.int);
    schemaToSearch.forEach((column) => {
      if (column.columnName === columnName) {
        foundColumn = column;
        return;
      }      
    });
    return foundColumn;
  }
}
