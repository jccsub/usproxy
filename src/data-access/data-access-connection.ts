

export interface DataAccessConnection {
  execute(command : string) : Promise<any>;
  getCatalog() : string; //Database or folder
  getUser() : string;
  getMachine() : string; //Server or machine

}