import { Log } from '../logger';
import { guarded, notNull } from '../utils/guards';
import { DataAccessConnection } from "../data-access/data-access-connection";
import { SimpleSqlConfiguration } from "./simple-sql-configuration";


const sql = require('mssql');


export class SimpleSqlDataConnection implements DataAccessConnection {
  private config: SimpleSqlConfiguration;
  private pool : any;
  private log : Log;

  constructor(connectionInfo: SimpleSqlConfiguration, log : Log) {
    // tslint:disable-next-line:triple-equals
    if (connectionInfo == null) {
      throw new Error('SqlDataConnection constructor expected a non-null connectionInfo');
    }
    this.log = log;
    this.pool = null;
    this.config = connectionInfo;
  }

  

  public async execute(command: string)  {    
    var result;
    sql.close();
    try {
        let pool = await sql.connect(this.config)
        result = await pool.request()
            .query(command)
            
    } catch (err) {
        throw err;
    }    
    return result;    
  }


  getCatalog(): string {
    return this.config.database;
  }
  
  getUser(): string {
    return this.config.user;
  }

  getMachine() : string {
    return this.config.server;
  }
  
}