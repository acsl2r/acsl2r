import { AcslType } from '../../enum';
import { IExpression } from '../../interface';
import { SectionBase } from './sectionbase';
import { getSymbolsRequired, getSymbolsProvided } from './objectmodel';

export default class ProceduralSection extends SectionBase
{
  constructor()
  {
    super("procedural");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    return this._inputs;
  }

  get symbolsProvided(): IExpression[]
  {
    return this._outputs;
  }

  get outputs()
  {
    return this._outputs;
  }

  get inputs()
  {
    return this._inputs;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
  }

  private _outputs: IExpression[] = [];
  private _inputs: IExpression[] = [];
}
