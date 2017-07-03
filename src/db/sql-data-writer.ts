import { guarded, isJson } from '../utils/guards';
import { DataWriter } from './data-writer';
import { SimpleSqlDataValidator } from '../simple-sql/simple-sql-data-validator';
import { SimpleSqlDataConnection } from '../simple-sql/simple-sql-data-connection';
import { SimpleSqlInsertGenerator } from '../simple-sql/simple-sql-insert-generator';
import { SimpleSqlTableGenerator } from '../simple-sql/simple-sql-table-generator';

export class SqlDataWriter implements DataWriter {
  private dataValidator : SimpleSqlDataValidator;
  private connection : SimpleSqlDataConnection;
  private sqlInsertGenerator : SimpleSqlInsertGenerator;
  private sqlTableGenerator : SimpleSqlTableGenerator
  
  constructor(connection : SimpleSqlDataConnection, 
    sqlInsertGenerator : SimpleSqlInsertGenerator, 
    sqlTableGenerator : SimpleSqlTableGenerator,   
    dataValidator : SimpleSqlDataValidator) {
    this.dataValidator = dataValidator;
    this.connection = connection;
    this.sqlInsertGenerator = sqlInsertGenerator;
    this.sqlTableGenerator = sqlTableGenerator;
    this.createDatabaseIfItDoesNotExist();
    this.createTableIfItDoesNotExist();
  }

  @guarded
  public async write(@isJson dataToWrite: any) {
    this.dataValidator.validate(dataToWrite);
    return await this.execute(this.sqlInsertGenerator.generateInsertStatement(dataToWrite)).then((result) => {
        // tslint:disable-next-line:triple-equals
        if (result == null) {
          throw new Error('SqlDataWriter.write - Did not receive a result back');
        }
        return result.rowsAffected[0];
    });
  }

  private createDatabaseIfItDoesNotExist() {
    
  }

  private createTableIfItDoesNotExist() {
    let sqlText = this.sqlTableGenerator.generateCreateTableIfItDoesNotExist();
    this.execute(sqlText);
  }
  
  private async execute(command : string) : Promise<any> {
    return this.connection.execute(command);
  }

}