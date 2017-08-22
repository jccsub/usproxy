"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_context_writer_1 = require("../domain-services/infusion-context-writer");
const sql = require('mssql');
class InfusionContextMssqlWriterConfig extends infusion_context_writer_1.InfusionContextWriterConfiguration {
    constructor(user, password, server, database) {
        super(user, password, server, database);
        this.pool = {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        };
    }
}
exports.InfusionContextMssqlWriterConfig = InfusionContextMssqlWriterConfig;
class InfusionContextMssqlWriter {
    constructor(log, config) {
        this.log = log;
        this.config = config;
    }
    write(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = new sql.ConnectionPool(this.config);
            pool.on('error', err => {
                this.log.error(`sql errors: ${err}`);
            });
            yield pool.connect(this.config);
            try {
                let result = yield pool.request()
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
        )`);
            }
            catch (err) {
                this.log.error(err);
                return { err: err };
            }
            finally {
                pool.close();
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pool = yield sql.connect(this.config);
                if (pool) {
                    this.log.debug('created sql pool');
                }
                let result = yield pool.request().query(`
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

          `);
            }
            catch (err) {
                this.log.error(`err: ${err.message}`);
            }
            this.log.info('successfully made it past initialize');
        });
    }
}
exports.InfusionContextMssqlWriter = InfusionContextMssqlWriter;
//# sourceMappingURL=infusion-context-mssql-writer.js.map