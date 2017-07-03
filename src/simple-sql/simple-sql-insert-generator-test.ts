import { Log } from '../logger';
import { expectException, stripWhitespaceAndLower } from '../utils/misc';
import { WinstonLog } from '../winston-logger';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';
import { SimpleSqlDataValidator } from './simple-sql-data-validator';
import { SimpleSqlInsertGenerator } from './simple-sql-insert-generator';
import { SimpleTestSchemaBuilder } from './simple-test-schema-builder';
import {should,expect} from 'chai';
import { suite, test, slow, timeout } from 'mocha-typescript';


@suite
export class SimpleSqlInsertGeneratorTest {

  protected generator : SimpleSqlInsertGenerator;
  protected tableSchema : SimpleTableSchema;
  protected validator : SimpleSqlDataValidator;
  protected log : Log;

  before() {
    this.log = new WinstonLog();
    this.tableSchema = SimpleTestSchemaBuilder.buildSchema();
    this.validator = new SimpleSqlDataValidator(this.tableSchema, this.log );    
    this.generator = new SimpleSqlInsertGenerator('test', this.tableSchema, this.validator, this.log);
  }

  @test
  generateInsertStatementAcceptsOnlyJsonData() {
    expectException(()=>this.generator.generateInsertStatement("test"));
  }

  @test
  generateInsertStatementDoesGenerateInsert() {
    let data = SimpleTestSchemaBuilder.generateData('name', 'description', 'Y', 'Hello', 5);
    let insertStatement = this.generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([name],[description],[optionalint],[max],[bigstring],[yesno],[uuid])values('name','description',5,'hello','defaulttext','y','${data.uuid}')`);
  }

  @test
  generateInsertStatementValidatesRequiredData() {
    let data = SimpleTestSchemaBuilder.generateData('name', 'description', 'Y', 'Hello', 5);
    delete data.name;
    expectException(() => { let insertStatement = this.generator.generateInsertStatement(data)});
  }

  @test
  generateColumnDefinitionGeneratesNonIdentityPrimaryKey() {
    let column1 = new SimpleColumn('pk',SimpleColumnDataType.int, SimpleColumnAttributes.primaryKey );
    let schema = [column1];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator,this.log );    
    let data = { pk:1 };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal('insertinto[test]([pk])values(1)');
  }

  @test
  generateColumnDefinitionGeneratesIdentityPrimaryKey() {
    let column1 = new SimpleColumn('pk',SimpleColumnDataType.int, SimpleColumnAttributes.primaryKey | SimpleColumnAttributes.identity );
    let column2 = new SimpleColumn('name',SimpleColumnDataType.string1024 );
    let schema = [column1,column2];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { name : 'my name' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([name])values('myname')`);    
  }

@test
  generateColumnDefinitionByDefaultGeneratesNonNullColumn() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.string255);
    let schema = [column1];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col1 : null };
    expectException( () => {let insertStatement = generator.generateInsertStatement(data); } );
  }  

@test
  generateColumnDefinitionGeneratesStringTypePrimaryKey() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.string255,SimpleColumnAttributes.primaryKey);
    let schema = [column1];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col1 : 'hello' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1])values('hello')`);
  }  

@test
  generateColumnDefinitionGeneratesOptionalButPresentCharStringColumn() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.char,SimpleColumnAttributes.optional);
    let column2 = new SimpleColumn('col2',SimpleColumnDataType.string1024);
    let schema = [column1,column2];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col1 : 'Y', col2 : 'name' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1],[col2])values('y','name')`);
  }  

@test
  generateColumnDefinitionGeneratesOptionalAndNotPresentCharStringColumn() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.char,SimpleColumnAttributes.optional);
    let column2 = new SimpleColumn('col2',SimpleColumnDataType.string1024);
    let schema = [column1,column2];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col2 : 'name' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col2])values('name')`);
  }  
  
@test
  generateColumnDefinitionGeneratesUuidIdentityColumn() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.uniqueidentifier,SimpleColumnAttributes.identity);
    let column2 = new SimpleColumn('col2',SimpleColumnDataType.string1024);
    let schema = [column1,column2];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col2 : 'name' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col2])values('name')`);
  }  

@test
  generateColumnDefinitionGeneratesUuidColumn() {
    let column1 = new SimpleColumn('col1',SimpleColumnDataType.uniqueidentifier);
    let column2 = new SimpleColumn('col2',SimpleColumnDataType.string1024);
    let schema = [column1,column2];
    let validator = new SimpleSqlDataValidator(schema, this.log);
    let generator = new SimpleSqlInsertGenerator('test', schema, validator, this.log);    
    let data = { col1 : '0880c11f-3c9a-4358-ad6e-47ce425c2f02', col2 : 'name' };
    let insertStatement = generator.generateInsertStatement(data);
    stripWhitespaceAndLower(insertStatement).should.equal(`insertinto[test]([col1],[col2])values('0880c11f-3c9a-4358-ad6e-47ce425c2f02','name')`);
  }  

}

