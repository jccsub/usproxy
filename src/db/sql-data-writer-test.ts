import * as TypeMoq from 'typemoq';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { Log } from '../logger';
import { SqlDataWriter } from './sql-data-writer';
import { WinstonLog } from "../winston-logger";
import {should,expect} from 'chai';
import { SimpleSqlDataConnection } from "../simple-sql/simple-sql-data-connection";
import { SimpleSqlDataValidator } from "../simple-sql/simple-sql-data-validator";
import { SimpleTableSchema, SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType } from "../simple-sql/simple-schema";
import { SimpleTestSchemaBuilder } from "../simple-sql/simple-test-schema-builder";
import { SimpleSqlInsertGenerator } from "../simple-sql/simple-sql-insert-generator";
import { SimpleSqlTableGenerator } from "../simple-sql/simple-sql-table-generator";

@suite
class SqlDataWriterTest {

  private dataWriter : SqlDataWriter;
  private mockConnection : TypeMoq.IMock<SimpleSqlDataConnection>;
  private dataValidator : TypeMoq.IMock<SimpleSqlDataValidator>;
  private mockSqlInsertGenerator : TypeMoq.IMock<SimpleSqlInsertGenerator>;
  private mockSqlTableGenerator : TypeMoq.IMock<SimpleSqlTableGenerator>;
  private schema : SimpleTableSchema;
  private log : Log;

  before() {
    this.mockConnection = TypeMoq.Mock.ofType<SimpleSqlDataConnection>();
    this.schema = SimpleTestSchemaBuilder.buildSchema();
    this.dataValidator = TypeMoq.Mock.ofType<SimpleSqlDataValidator>();
    this.mockSqlInsertGenerator = TypeMoq.Mock.ofType<SimpleSqlInsertGenerator>();
    this.mockSqlTableGenerator = TypeMoq.Mock.ofType<SimpleSqlTableGenerator>();
    this.dataWriter = new SqlDataWriter(this.mockConnection.object,this.mockSqlInsertGenerator.object, this.mockSqlTableGenerator.object, this.dataValidator.object);    
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
        this.dataValidator.verify(x=>x.validate(TypeMoq.It.isAny()),TypeMoq.Times.once());
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