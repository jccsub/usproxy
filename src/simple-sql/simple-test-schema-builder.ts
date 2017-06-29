import { generateUuid } from '../utils/misc';
import { SimpleColumn, SimpleColumnAttributes, SimpleColumnDataType, SimpleTableSchema } from './simple-schema';

  
  export class SimpleTestSchemaBuilder {
    static id : number = 0;

    static buildSchema() : SimpleTableSchema {
      let schema = new Array<SimpleColumn>();
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

    static generateData(name : string, description : string, yesNo : string, max : string, optionalInt? : number) : any {
      return {
        id : undefined, //This is because the identity column must not be given a value
        optionalInt : optionalInt,
        name : name,        
        description : description,
        yesNo : yesNo,
        bigString : 'default text',
        uuid : generateUuid(),
        max : max
      }
    }

    private static createIdColumn() : SimpleColumn {
      return new SimpleColumn('id', SimpleColumnDataType.int, SimpleColumnAttributes.primaryKey | SimpleColumnAttributes.identity);
    }

    private static createUuidColumn() : SimpleColumn {
      return new SimpleColumn('uuid', SimpleColumnDataType.uniqueidentifier);
    }

    private static createNameColumn() : SimpleColumn {
      return new SimpleColumn('name', SimpleColumnDataType.string255);
    }

    private static createMaxColumn() : SimpleColumn {
      return new SimpleColumn('max', SimpleColumnDataType.stringMax);
    }

    private static createDescriptionColumn() : SimpleColumn {
      return new SimpleColumn('description', SimpleColumnDataType.string1024);
    }

    private static createYesNoColumn() : SimpleColumn {
      return new SimpleColumn('yesNo', SimpleColumnDataType.char);
    }

    private static createBigStringColumn() : SimpleColumn {
      return new SimpleColumn('bigString', SimpleColumnDataType.string4096);
    }

    private static createOptionalIntColumn() : SimpleColumn {
      return new SimpleColumn('optionalInt', SimpleColumnDataType.int,SimpleColumnAttributes.optional );
    }    
    
  }