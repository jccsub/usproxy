import { Log } from '../../logger';
import { ModificationQueryFunction } from '../domain/infusion-modification';
import { InfusionConfiguration } from '../domain/infusion-configuration';


export class MarkupModifier {

  private configuration : InfusionConfiguration;
  private log : Log;

  constructor(log : Log, configuration : InfusionConfiguration) {
    this.configuration = configuration;
    this.log = log;
  }

  public performModifications(url : string, req, res) {
    var getProcessorFunction = require('harmon');
    var func = getProcessorFunction([],this.getModificationQueryFunctions(url));
    func(req, res, () => {});  
  }

  private getModificationQueryFunctions(url : string) : Array<ModificationQueryFunction> {
    let result = new Array<ModificationQueryFunction>();
    this.configuration.modifications.forEach((modification) => {
      if (modification.urlPattern.test(url)) {
        this.log.debug(`urlPattern matched...pattern:${modification.urlPattern}, url:${url}`)
        result.push(modification.convertToQueryFunction());
      }
      else {
        this.log.debug(`urlPattern NOT matched...pattern:${modification.urlPattern}, url:${url}`)
      }
    });
    return result;
  }
 

}