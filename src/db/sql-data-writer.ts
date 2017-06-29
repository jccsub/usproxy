import { guarded, isJson } from '../utils/guards';
import { DataWriter } from './data-writer';
import { SimpleSchemaValidator } from "../simple-sql/simple-schema-validator";
import { SimpleSqlDataConnection } from "../simple-sql/simple-sql-data-connection";
import { SimpleSqlGenerator } from "../simple-sql/simple-sql-generator";

export class SqlDataWriter implements DataWriter {
  private schemaValidator : SimpleSchemaValidator;
  private connection : SimpleSqlDataConnection;
  private sqlGenerator : SimpleSqlGenerator;
  
  constructor(connection : SimpleSqlDataConnection, sqlGenerator : SimpleSqlGenerator, tableSchemaValidator : SimpleSchemaValidator) {
    this.schemaValidator = tableSchemaValidator;
    this.connection = connection;
    this.sqlGenerator = sqlGenerator;
    this.createDatabaseIfItDoesNotExist();
    this.createTableIfItDoesNotExist();
  }

  @guarded
  public async write(@isJson dataToWrite: any) {
    this.schemaValidator.validate(dataToWrite);
    return await this.execute(this.sqlGenerator.generateInsertStatement(dataToWrite)).then((result) => {
        // tslint:disable-next-line:triple-equals
        if (result == null) {
          throw new Error('SqlDataWriter.write - Did not receive a result back');
        }
        return result.rowsAffected[0];
    });
    
  }

  private createDatabaseIfItDoesNotExist() {
    let sqlText = this.sqlGenerator.generateCreateDatabaseIfItDoesNotExist();
    this.execute(sqlText);
  }

  private createTableIfItDoesNotExist() {
    let sqlText = this.sqlGenerator.generateCreateTableIfItDoesNotExist();
    this.execute(sqlText);
  }
  
  private async execute(command : string) : Promise<any> {
    return this.connection.execute(command);
  }

 

}