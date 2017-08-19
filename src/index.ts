import { OnionTestSetup } from '../test/onion-test-setup';
import { RCloudTestSetup } from '../test/rcloud-test-setup';
import { HttpBinTestSetup } from '../test/httpbin-test-setup';

//var testSetup = new HttpBinTestSetup();
//var testSetup = new RCloudTestSetup();

var testSetup = new OnionTestSetup();

testSetup.startTest();




