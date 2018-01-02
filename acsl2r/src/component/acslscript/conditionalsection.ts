import { AcslType } from '../../enum';
import { IExpression } from '../../interface';
import { SectionBase } from './sectionbase';
import { getSymbolsRequired, getSymbolsProvided } from './objectmodel';
import { applyAcslTypesToExpression } from './objectmodel';

export default class ConditionalSection extends SectionBase
{
  constructor()
  {
    super("conditional");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    let symbolsProvided = this.symbolsProvided;
    let required = getSymbolsRequired(symbolsProvided, this.codeBlocks);
    if (!!this.condition)
    {
      required.push(...this.condition.symbols);
    }
    return required;
  }

  get symbolsProvided(): IExpression[]
  {
    let symbolsProvided = getSymbolsProvided(this.codeBlocks);
    return symbolsProvided;
  }

  get condition()
  {
    return this._condition;
  }

  set condition(value: IExpression)
  {
    this._condition = value;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);

    if (!!this._condition)
    {
      let replacement = applyAcslTypesToExpression(this._condition, typeDictionary);
      if (!!replacement) this._condition = replacement;
      this._condition.applyAcslTypes(typeDictionary);
    }
  }

  private _condition: IExpression;
}
