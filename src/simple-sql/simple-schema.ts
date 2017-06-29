

export enum SimpleColumnDataType {
  int,
  uniqueidentifier,
  string255,
  string1024,
  string4096,  
  char,
  stringMax
}

export enum SimpleColumnAttributes {
  identity = 1,
  primaryKey = 2,
  optional = 4
}

export class SimpleColumn {
  private _attributes : SimpleColumnAttributes = 0;
  public readonly columnName : string;
  public readonly dataType : SimpleColumnDataType;

  constructor(columnName : string, dataType : SimpleColumnDataType, attributes : SimpleColumnAttributes = 0) {    
    this.columnName = columnName;
    this.dataType = dataType;
    this.attributes = attributes;
  }

  public get attributes() : SimpleColumnAttributes {
    return this._attributes;
  
  }

  public set attributes(attributes : SimpleColumnAttributes) {
    this.validateAttributes(attributes);
    this._attributes = attributes;
  }

  public isIdentity() : boolean {
    return (this.attributes & SimpleColumnAttributes.identity) === SimpleColumnAttributes.identity;
  }

  public isPrimaryKey() : boolean {
    return (this.attributes & SimpleColumnAttributes.primaryKey) === SimpleColumnAttributes.primaryKey;
  }

  public isOptional() : boolean {
    return (this.attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional;
  } 
  public getDefinition() : string {
    // tslint:disable-next-line:triple-equals
    let def = `${this.columnName} `;
    switch(this.dataType) {
      case SimpleColumnDataType.int : { def += 'int '; break;}
      case SimpleColumnDataType.char : { def += 'char(1) '; break;}      
      case SimpleColumnDataType.string1024 : { def += 'varchar(1024) '; break;}
      case SimpleColumnDataType.string255 : { def += 'varchar(255) '; break;}
      case SimpleColumnDataType.string4096 : { def += 'varchar(4096) '; break;}      
      case SimpleColumnDataType.stringMax : { def += 'varchar(MAX) '; break;}
      case SimpleColumnDataType.uniqueidentifier : { def += 'uniqueidentifier '; break;}      
      default : { throw new Error(`SimpleColumn.getDefinition() - Not a valid data type for ${def} : ${this.dataType}`) }
    }

    if (this.isPrimaryKey()) {
      def += 'primary key ';    
    }

    if (this.isIdentity()) {
      switch (this.dataType) {
        case SimpleColumnDataType.int : { def += 'identity(1,1) '; break;}
        case SimpleColumnDataType.uniqueidentifier : { def += 'default newid() '; break;}
        default: { throw new Error(`SimpleColumn.getDefinition() - Identity must be either an int or uniqueidentifier: ${def}`) }
      }
    }
    if (!this.isOptional() && (!(this.isIdentity() && (this.dataType === SimpleColumnDataType.uniqueidentifier))) ) {
      def += 'not null '
    }
    return def;
  }

  private validateAttributes(attributes : SimpleColumnAttributes) {
    if (((attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional) &&
       ((attributes & SimpleColumnAttributes.primaryKey) === SimpleColumnAttributes.primaryKey) ) {
          throw new Error('A column cannot be both primary key and optional. If it is a ' +
          'primary key then it is either an identity and must not be provided or it is not an identity and ' +
          'must be provided.');
       }
    if (((attributes & SimpleColumnAttributes.optional) === SimpleColumnAttributes.optional) &&
       ((attributes & SimpleColumnAttributes.identity) === SimpleColumnAttributes.identity) ) {
          throw new Error('A column cannot be both an identity and optional. If it is an ' +
          'identity then it must not be provided');
       }
  }
}

export type SimpleTableSchema = Array<SimpleColumn>;



