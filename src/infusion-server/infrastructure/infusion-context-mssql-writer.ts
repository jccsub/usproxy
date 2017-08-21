import { InfusionContext } from '../domain/infusion-context';
import {
  InfusionContextWriter,
  InfusionContextWriterConfiguration,
} from '../domain-services/infusion-context-writer';

const sql = require('mssql');

export class InfusionContextMssqlWriterConfig extends InfusionContextWriterConfiguration {
  public pool : any;

  constructor(user : string, password : string, server : string, database : string) {
    super(user, password, server, database);
    this.pool = {
      max : 10,
      min : 0,
      idleTimeoutMillis: 30000
    }
  }
}

export class InfusionContextMssqlWriter implements InfusionContextWriter {
  
  public async write(config: InfusionContextMssqlWriterConfig, context: InfusionContext) {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query('insert ')
  }
}