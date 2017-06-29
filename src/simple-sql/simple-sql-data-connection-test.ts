import { WinstonLog } from '../winston-logger';
import { suite, test, slow, timeout } from 'mocha-typescript';
import { Log } from "../logger";
import {should,expect} from 'chai';
import { SimpleSqlDataConnection } from "./simple-sql-data-connection";
import { SimpleSqlConfiguration } from "./simple-sql-configuration";

class SimpleSqlDataConnectionTests {
  protected dataConnection : SimpleSqlDataConnection;
  private connectionInfo : SimpleSqlConfiguration; 
  protected log : Log;
  protected createConnectionInfo() : SimpleSqlConfiguration {
    let connectionInfo = new SimpleSqlConfiguration();
    connectionInfo.server = 'localhost';
    connectionInfo.database = 'usproxy';
    connectionInfo.user = 'dev';
    connectionInfo.password = 'usg';
    return connectionInfo;
  }

  protected createConnection() {
    return new SimpleSqlDataConnection(this.createConnectionInfo(), this.log);
  }

  before() {
    this.log = new WinstonLog();
    this.dataConnection = this.createConnection();
  }

}

@suite
class SqlDataConnectionInfoTests extends SimpleSqlDataConnectionTests {

  @test
  getCatalogReturnsTheDatabaseName() {
    this.dataConnection.getCatalog().should.equal('usproxy');
  }

  getUserReturnsTheDatabaseUser() {
    this.dataConnection.getUser().should.equal('dev');
  }

  getMachineReturnsTheDatabaseServer() {
    this.dataConnection.getMachine().should.equal('localhost');
  }

}


@suite
class SqlDataConnectionExecuteTests extends SimpleSqlDataConnectionTests {

  before() {
    super.before();
  }
  after() {
  }

  @test
  async executingASelectThatReturnsMoreThanOneRowIsSuccessful() {
    await this.dataConnection.execute('select * from master..sysdatabases').then((result) => {
      return new Promise((resolve,reject) => {
        try {
          expect(result.recordset.length).to.be.greaterThan(1);
        }
        catch(err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  @test
  async executingASelectThatReturnsZeroRowsIsSuccessful() {
    await this.dataConnection.execute('select * from master..sysdatabases where name = \'no_database\'').then((result) => {
      return new Promise((resolve,reject) => {
        try {
          expect(result.recordset.length).to.equal(0);
        }
        catch(err) {
          reject(err);
        }
        resolve();
      })
    });       
  }


}