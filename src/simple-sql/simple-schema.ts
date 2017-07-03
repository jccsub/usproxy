

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



