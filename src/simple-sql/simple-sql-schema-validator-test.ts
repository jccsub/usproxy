import { WinstonLog } from '../winston-logger';
import { Log } from '../logger';
import { SimpleColumn, SimpleTableSchema } from './simple-schema';
import { SimpleSqlDataValidator } from './simple-sql-data-validator';
import { SimpleSqlConfiguration } from './simple-sql-configuration';
import { SimpleSqlDataConnection } from './simple-sql-data-connection';
import { SimpleTestSchemaBuilder } from './simple-test-schema-builder';
import { suite, test, slow, timeout } from 'mocha-typescript';
import { expectException } from "../utils/misc";


@suite
class SimpleSqlSchemaValidatorTest {

  private simpleSchemaValidator : SimpleSqlDataValidator;
  private testData : any
  private log : Log;

  public before() {
    this.log = new WinstonLog();
    this.simpleSchemaValidator = new SimpleSqlDataValidator(SimpleTestSchemaBuilder.buildSchema(),this.log);
    this.testData = SimpleTestSchemaBuilder.generateData('col1', 'this is col1','Y','whole lot of text', 10);
  }

  @test
  public goodSchemaValidatesSuccessfully() {
    this.simpleSchemaValidator.validate(this.testData);
  }

  @test
  public valueProvidedForIdentityColumnThrowsException() {
    (this.testData as any).id = 1;
    expectException(() => {this.simpleSchemaValidator.validate(this.testData);});
  }

  @test
  public nonOptionalValueMustExist() {
    delete (this.testData as any).name;
    expectException(() => {this.simpleSchemaValidator.validate(this.testData);});
  }

  @test
  public anIntColumnMustContainAnIntegerValue() {
    (this.testData as any).optionalInt = 7.2;
    expectException(() => {this.simpleSchemaValidator.validate(this.testData);});    
  }

  @test
  public stringTypeCannotBeNullIfNotOptional() {
    (this.testData as any).description = null;
    expectException(() => {this.simpleSchemaValidator.validate(this.testData);});
  }

  @test
  public stringCannotExceedSpecifiedCharacters() {
    (this.testData as any).name = Array(258).join('x'); //name is a string255    
    expectException(() => {this.simpleSchemaValidator.validate(this.testData);});    
  }

  @test
  public noProblemInAssigningNonStringToStringField() {
    (this.testData as any).name = 12345;
    this.simpleSchemaValidator.validate(this.testData);
  }

  @test
  public invalidUuidIsCaught() {
    (this.testData as any).uuid = '12345-12345-1';
    expectException(() => {this.simpleSchemaValidator.validate(this.testData)});
  }

  @test
  public unexpectedDataTypeIsCaught() {
    let schema = SimpleTestSchemaBuilder.buildSchema();
    let col = new SimpleColumn('test', 500);
    schema.push(col);
    (this.testData as any).test = 'not valid since dataType is not valid';
    this.simpleSchemaValidator = new SimpleSqlDataValidator(schema, this.log);
    expectException(() => this.simpleSchemaValidator.validate(this.testData));
  }
  



}