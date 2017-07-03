import { SimpleColumnDataType, SimpleTableSchema,SimpleColumnAttributes,SimpleColumn } from './simple-schema';
import { Log } from '../logger';
import { guarded, isJson } from '../utils/guards';


export class SimpleSqlSchemaValidator {

  private tableSchema : SimpleTableSchema;
  private log : Log;

  constructor(tableSchema : SimpleTableSchema, log : Log) {
    this.tableSchema = tableSchema;
    this.log = log;
  }
  
  @guarded
  public validate() {
    this.validateTableMustHaveOneColumnThatIsNeitherIdentityNorOptional();
  }

  protected validateTableMustHaveOneColumnThatIsNeitherIdentityNorOptional() {
    let found = false;
    this.tableSchema.forEach((column) => {
      if (!column.isIdentity() && !column.isOptional()) {
        found = true;
      }
    });
    if (!found) {
      throw new Error('SimpleSqlSchemaValidator - A table must have one column that is neither identity nor optional')      
    }
 
 }
}