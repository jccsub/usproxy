import { InfusionContext } from '../domain/infusion-context';

export class InfusionContextWriterConfiguration {
  public user: string;
  public password : string;
  public readonly server : string;
  public readonly database : string;

  constructor(user : string, password : string, server : string, database : string) {
    this.user = user;
    this.password = password;
    this.server = server;
    this.database = database;
  }
}

export interface InfusionContextWriter {
  write(config : InfusionContextWriterConfiguration,  context : InfusionContext);
}