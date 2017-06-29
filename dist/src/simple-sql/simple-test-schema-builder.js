"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("../utils/misc");
const simple_schema_1 = require("./simple-schema");
class SimpleTestSchemaBuilder {
    static buildSchema() {
        let schema = new Array();
        schema.push(this.createIdColumn());
        schema.push(this.createNameColumn());
        schema.push(this.createDescriptionColumn());
        schema.push(this.createOptionalIntColumn());
        schema.push(this.createMaxColumn());
        schema.push(this.createBigStringColumn());
        schema.push(this.createYesNoColumn());
        schema.push(this.createUuidColumn());
        return schema;
    }
    static generateData(name, description, yesNo, max, optionalInt) {
        return {
            id: undefined,
            optionalInt: optionalInt,
            name: name,
            description: description,
            yesNo: yesNo,
            bigString: 'default text',
            uuid: misc_1.generateUuid(),
            max: max
        };
    }
    static createIdColumn() {
        return new simple_schema_1.SimpleColumn('id', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.primaryKey | simple_schema_1.SimpleColumnAttributes.identity);
    }
    static createUuidColumn() {
        return new simple_schema_1.SimpleColumn('uuid', simple_schema_1.SimpleColumnDataType.uniqueidentifier);
    }
    static createNameColumn() {
        return new simple_schema_1.SimpleColumn('name', simple_schema_1.SimpleColumnDataType.string255);
    }
    static createMaxColumn() {
        return new simple_schema_1.SimpleColumn('max', simple_schema_1.SimpleColumnDataType.stringMax);
    }
    static createDescriptionColumn() {
        return new simple_schema_1.SimpleColumn('description', simple_schema_1.SimpleColumnDataType.string1024);
    }
    static createYesNoColumn() {
        return new simple_schema_1.SimpleColumn('yesNo', simple_schema_1.SimpleColumnDataType.char);
    }
    static createBigStringColumn() {
        return new simple_schema_1.SimpleColumn('bigString', simple_schema_1.SimpleColumnDataType.string4096);
    }
    static createOptionalIntColumn() {
        return new simple_schema_1.SimpleColumn('optionalInt', simple_schema_1.SimpleColumnDataType.int, simple_schema_1.SimpleColumnAttributes.optional);
    }
}
SimpleTestSchemaBuilder.id = 0;
exports.SimpleTestSchemaBuilder = SimpleTestSchemaBuilder;
//# sourceMappingURL=simple-test-schema-builder.js.map