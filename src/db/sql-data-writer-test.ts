import * as TypeMoq from 'typemoq';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { Log } from '../logger';
import { SqlDataWriter } from './sql-data-writer';
import { WinstonLog } from "../winston-logger";
import {should,expect} from 'chai';
import { SimpleSqlDataConnection } from "../simple-sql/simple-sql-data-connection";
import { SimpleSchemaValidator } from "../simple-sql/simple-schema-validator";
import { SimpleSqlGenerator } from "../simple-sql/simple-sql-generator";
import { SimpleTableSchema, SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType } from "../simple-sql/simple-schema";
import { SimpleTestSchemaBuilder } from "../simple-sql/simple-test-schema-builder";

@suite
class SqlDataWriterTest {

  private dataWriter : SqlDataWriter;
  private mockConnection : TypeMoq.IMock<SimpleSqlDataConnection>;
  private schemaValidator : TypeMoq.IMock<SimpleSchemaValidator>;
  private mockSqlGenerator : TypeMoq.IMock<SimpleSqlGenerator>;
  private schema : SimpleTableSchema;
  private log : Log;

  before() {
    this.mockConnection = TypeMoq.Mock.ofType<SimpleSqlDataConnection>();
    this.schema = SimpleTestSchemaBuilder.buildSchema();
    this.schemaValidator = TypeMoq.Mock.ofType<SimpleSchemaValidator>();
    this.mockSqlGenerator = TypeMoq.Mock.ofType<SimpleSqlGenerator>();
    this.dataWriter = new SqlDataWriter(this.mockConnection.object,this.mockSqlGenerator.object, this.schemaValidator.object);    
    this.mockConnection.setup(x=>x.execute(TypeMoq.It.isAny())).returns(async () => {  
      let rowsAffected = new Array<number>(); 
      rowsAffected.push(1);
      return {
        rowsAffected : rowsAffected
      }
    });
    this.log = new WinstonLog();
  }

  @test
  async writeFailsIfDataToWriteIsNotJson() {
    let errorOccured = false;
    try {
      await this.dataWriter.write('test')
    }
    catch(err) {
      errorOccured = true;
    }
    if (!errorOccured) {
      throw new Error('expected error');
    }
  }

  @test
  async writeValidatesTheSchemaOfTheData() {
    let goodData = this.createGoodData();
    await this.dataWriter.write(goodData).then( () => {      
      let errorOccured = null;
      try {
        this.schemaValidator.verify(x=>x.validate(TypeMoq.It.isAny()),TypeMoq.Times.once());
      }
      catch(err) {
        errorOccured = err;
      }
      return new Promise((resolve,reject) =>{
        if (errorOccured) {
          reject(errorOccured);
        }
        else {
          resolve();
        }

      })
    });
  }

  private createGoodData() {
    return {
      name : 'name1',
      description : 'description'
    };
  }



}