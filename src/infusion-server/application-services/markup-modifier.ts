import { ModificationQueryFunction } from '../domain/infusion-modification';
import { InfusionConfiguration } from '../domain/infusion-configuration';


export class MarkupModifier {

  private configuration : InfusionConfiguration;

  constructor(configuration : InfusionConfiguration) {
    this.configuration = configuration;
  }

  public performModifications(req, res) {
    var getProcessorFunction = require('harmon');
    var func = getProcessorFunction([],this.getModificationQueryFunctions());
    func(req, res, () => {});  
  }

  private getModificationQueryFunctions() : Array<ModificationQueryFunction> {
    let result = new Array<ModificationQueryFunction>();
    this.configuration.modifications.forEach((modification) => {
      result.push(modification.convertToQueryFunction());
    });
    return result;
  }
 

}