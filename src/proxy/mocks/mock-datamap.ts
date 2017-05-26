import { DataMap } from '../../mapper/data-map';



export class MockDataMap implements DataMap {
  public content: any = {};

  public toString(): string {
    return 'MockDataMap.toString()';
  }

  public addContent(jsonContent: any) {
    for (var key in jsonContent) {
      this.content[key] = jsonContent[key];
    }
  }
}