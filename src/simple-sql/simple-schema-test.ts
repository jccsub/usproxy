import { WinstonLog } from '../winston-logger';
import { Log } from '../logger';
import { expectException } from '../utils/misc';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';
import { SimpleSchemaValidator } from './simple-schema-validator';
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

  @test
  getDefinitionGetsNonIdentityPrimaryKey() {
    let column = new SimpleColumn('pk',SimpleColumnDataType.int, SimpleColumnAttributes.primaryKey);
    column.getDefinition().toLowerCase().trim().should.equal('pk int primary key not null');
  }

  @test
  getDefinitionGetsIdentityPrimaryKey() {
    let column = new SimpleColumn('col',SimpleColumnDataType.int, SimpleColumnAttributes.primaryKey | SimpleColumnAttributes.identity);
    column.getDefinition().toLowerCase().trim().should.equal('col int primary key identity(1,1) not null');
  }

@test
  getDefinitionByDefaultGetsNonNullColumn() {
    let column = new SimpleColumn('col',SimpleColumnDataType.string255);
    column.getDefinition().toLowerCase().trim().should.equal('col varchar(255) not null');
  }  

@test
  getDefinitionGetsStringTypePrimaryKey() {
    let column = new SimpleColumn('col',SimpleColumnDataType.string1024, SimpleColumnAttributes.primaryKey);
    column.getDefinition().toLowerCase().trim().should.equal('col varchar(1024) primary key not null');
  }  

@test
  getDefinitionGetsOptionalBigStringColumn() {
    let column = new SimpleColumn('col',SimpleColumnDataType.string4096, SimpleColumnAttributes.optional);
    column.getDefinition().toLowerCase().trim().should.equal('col varchar(4096)');
  }  

@test
  getDefinitionGetsOptionalMaxStringColumn() {
    let column = new SimpleColumn('col',SimpleColumnDataType.stringMax, SimpleColumnAttributes.optional);
    column.getDefinition().toLowerCase().trim().should.equal('col varchar(max)');
  }  

@test
  getDefinitionGetsOptionalCharStringColumn() {
    let column = new SimpleColumn('col',SimpleColumnDataType.char, SimpleColumnAttributes.optional);
    column.getDefinition().toLowerCase().trim().should.equal('col char(1)');
  }  

@test
  getDefinitionGetsUuidIdentityColumn() {
    let column = new SimpleColumn('col',SimpleColumnDataType.uniqueidentifier, SimpleColumnAttributes.identity);
    column.getDefinition().toLowerCase().trim().should.equal('col uniqueidentifier default newid()');
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
