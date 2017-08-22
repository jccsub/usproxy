import { Log } from '../../logger';
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
  
  private log : Log;
  private config : InfusionContextMssqlWriterConfig;
  constructor(log : Log, config: InfusionContextMssqlWriterConfig) {
    this.log = log;
    this.config = config;
  }
  public async write(context: InfusionContext) {
    const pool = new sql.ConnectionPool(this.config);
    pool.on('error', err => {
      this.log.error(`sql errors: ${err}`);
    });

    await pool.connect(this.config);
    try {
      let result = await pool.request()
      .input('responseBody', sql.VarChar(sql.MAX), context.response.body)
      .input('responseHeaders', sql.VarChar(8000), JSON.stringify(context.response.headers))
      .input('responseStatusCode', sql.Char(255), context.response.statusCode)
      .input('requestBody', sql.VarChar(sql.MAX), context.request.body)
      .input('requestHeaders', sql.VarChar(8000), JSON.stringify(context.request.headers))
      .input('requestUrl', sql.VarChar(3000), context.request.fullUrl)
      .input('requestProtocol', sql.Char(10), context.request.protocol)
      .input('requestHost', sql.VarChar(3000), context.request.host)
      .input('requestMethod', sql.Char(10), context.request.method)
      .input('requestApplicationSessionId', sql.Char(255), context.request.sessionId)
      .input('modifications', sql.VarChar(4000), JSON.stringify(context.modifications))
      .input('rewritePath', sql.Char(255), context.rewritePath)
      .input('error', sql.VarChar(2000), context.error)
      .input('userName', sql.Char(255), context.user)
      .query(`
          INSERT INTO [usproxy].[dbo].[context]
          ([time]
          ,[responseBody]
          ,[responseHeaders]
          ,[responseStatusCode]
          ,[requestBody]
          ,[requestHeaders]
          ,[requestUrl]
          ,[requestProtocol]
          ,[requestHost]
          ,[requestMethod]
          ,[requestApplicationSessionId]
          ,[modifications]
          ,[rewritePath]
          ,[error]
          ,[userName])
      VALUES (
          GETDATE()
          ,@responseBody
          ,@responseHeaders
          ,@responseStatusCode
          ,@requestBody
          ,@requestHeaders
          ,@requestUrl
          ,@requestProtocol
          ,@requestHost
          ,@requestMethod
          ,@requestApplicationSessionId
          ,@modifications
          ,@rewritePath
          ,@error
          ,@userName
        )`
      )
    }
    catch(err) {
      this.log.error(err);
      return {err : err};
    }
    finally {
      pool.close();
    }
  }

  public async initialize() {
    try {
      let pool =await sql.connect(this.config);
      if (pool) {
        this.log.debug('created sql pool');
      }
      let result = await pool.request().query(`
          IF  NOT EXISTS (SELECT * FROM sys.objects 
            WHERE object_id = OBJECT_ID(N'[dbo].[context]') 
            AND type in (N'U'))
            CREATE TABLE [dbo].[context](
              [contextId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
              [time] [datetime] DEFAULT GETDATE() NOT NULL,
              [responseBody] [VarChar](max) NULL,
              [responseHeaders] [VarChar](8000) NULL,
              [responseStatusCode] [Char](255) NULL,
              [requestBody] [VarChar](max) NULL,
              [requestHeaders] [VarChar](8000) NULL,
              [requestUrl] [VarChar](3000) NULL,
              [requestProtocol] [Char](10) NULL,
              [requestHost] [VarChar](3000) NULL,
              [requestMethod] [Char](10) NULL,
              [requestApplicationSessionId] [Char](255) NULL,
              [modifications] [VarChar](4000) NULL,
              [rewritePath] [Char](255) NULL,
              [error] [VarChar](2000) NULL,
              [userName] [Char](255) NULL
            )

          `)
        }
        catch(err) {
          this.log.error(`err: ${err.message}`)
        }
        this.log.info('successfully made it past initialize');

  }
}