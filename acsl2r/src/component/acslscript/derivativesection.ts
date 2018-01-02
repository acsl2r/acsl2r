import { AcslType } from '../../enum';
import { IExpression, IComment, IStatement } from '../../interface';
import { SectionBase } from './sectionbase';

export default class DerivativeSection extends SectionBase
{
  constructor()
  {
    super("derivative");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    throw new Error("Not implemented");
  }

  get symbolsProvided(): IExpression[]
  {
    throw new Error("Not implemented");
  }

  get integs()
  {
    return this._integs;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    this._integs.forEach(i => i.applyAcslTypes(typeDictionary));
  }

  private _integs: IStatement[] = [];
}
