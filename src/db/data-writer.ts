
export interface DataWriter {
  /*async*/write(dataToWrite : any) : Promise<number>; //returns rowsAffected
}