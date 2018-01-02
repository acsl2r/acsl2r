import { AcslType } from '../../enum';
import { IExpression } from '../../interface';
import { SectionBase } from './sectionbase';

export default class TerminalSection extends SectionBase
{
  constructor()
  {
    super("terminal");
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

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
  }
}
