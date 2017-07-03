"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_schema_1 = require("./simple-schema");
const misc_1 = require("../utils/misc");
class SimpleSqlTableGenerator {
    constructor(tableName, tableSchema, sqlValidator, log) {
        this.tableName = tableName;
        this.tableSchema = tableSchema;
        this.log = log;
        this.validator = sqlValidator;
    }
    generateCreateTableIfItDoesNotExist() {
        var sqlStatement = `if not exists(select * from sysobjects where name='${this.tableName}' and xtype='U') `;
        sqlStatement += `create table ${this.tableName} ( `;
        let first = true;
        this.tableSchema.forEach((column) => {
            console.log(column.columnName);
            sqlStatement += misc_1.getCommaIfNeeded(!first);
            first = false;
            sqlStatement += this.generateColumnDefinition(column);
        });
        sqlStatement += this.generatePrimaryKeyConstraint();
        sqlStatement += `)`;
        return sqlStatement;
    }
    generatePrimaryKeyConstraint() {
        let first = true;
        let list = '';
        this.tableSchema.forEach((column) => {
            if (column.isPrimaryKey()) {
                list += misc_1.getCommaIfNeeded(!first);
                first = false;
                list += column.columnName;
            }
        });
        return ` primary key (${list})`;
    }
    generateColumnDefinition(column) {
        let def = `${column.columnName} `;
        switch (column.dataType) {
            case simple_schema_1.SimpleColumnDataType.int: {
                def += 'int ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.char: {
                def += 'char(1) ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.string1024: {
                def += 'varchar(1024) ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.string255: {
                def += 'varchar(255) ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.string4096: {
                def += 'varchar(4096) ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.stringMax: {
                def += 'varchar(MAX) ';
                break;
            }
            case simple_schema_1.SimpleColumnDataType.uniqueidentifier: {
                def += 'uniqueidentifier ';
                break;
            }
            default: {
                throw new Error(`SimpleSqlGenerator.getColumnDefinition() - Not a valid data type for ${def} : ${column.dataType}`);
            }
        }
        if (column.isIdentity()) {
            switch (column.dataType) {
                case simple_schema_1.SimpleColumnDataType.int: {
                    def += 'identity(1,1) ';
                    break;
                }
                case simple_schema_1.SimpleColumnDataType.uniqueidentifier: {
                    def += 'default newid() ';
                    break;
                }
                default: {
                    throw new Error(`SimpleSqlGenerator.getColumnDefinition() - Identity must be either an int or uniqueidentifier: ${def}`);
                }
            }
        }
        if (!column.isOptional() && (!(column.isIdentity() && (column.dataType === simple_schema_1.SimpleColumnDataType.uniqueidentifier)))) {
            def += 'not null ';
        }
        return def;
    }
}
exports.SimpleSqlTableGenerator = SimpleSqlTableGenerator;
//# sourceMappingURL=simple-sql-table-generator.js.map