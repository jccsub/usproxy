import { DataWriter } from '../db/data-writer';
import { Log } from '../logger';
import { WinstonLog } from '../winston-logger';
import { DataMap } from './data-map';
import { DataMapWriter } from './data-map-writer';
import { suite, test } from 'mocha-typescript';
import * as TypeMoq from 'typemoq';


@suite
class DataMapWriterTests {
  protected underTest : DataMapWriter;
  protected dataMap : DataMap;
  protected log : Log;

  protected dataWriter : TypeMoq.IMock<DataWriter>;

  before() {
    this.log = new WinstonLog();
    this.dataMap = new DataMap(this.log);
    this.dataWriter = TypeMoq.Mock.ofType<DataWriter>();
    this.underTest = new DataMapWriter(this.dataWriter.object, this.log);
  }

  @test
  writeCallsDataWriter() {
    this.underTest.write(this.dataMap);
    this.dataWriter.verify(x=>x.write(TypeMoq.It.isAny()), TypeMoq.Times.once());
  }

}