import { AcslType } from '../../enum';
import { IExpression } from '../../interface';
import { SectionBase } from './sectionbase';
import ConditionalSection from './conditionalsection';

export default class IfSection extends SectionBase
{
  constructor()
  {
    super("if");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    let symbolsRequired = [];
    this.conditionalSections.forEach(cs => symbolsRequired.push(...cs.symbolsRequired));
    return symbolsRequired;
  }

  get symbolsProvided(): IExpression[]
  {
    let symbolsProvided = [];
    this.conditionalSections.forEach(cs => symbolsProvided.push(...cs.symbolsProvided));
    return symbolsProvided;
  }

  get conditionalSections()
  {
    return this._conditionalSections;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    this._conditionalSections.forEach(cs => cs.applyAcslTypes(typeDictionary));
  }

  private _conditionalSections: ConditionalSection[] = [];
}
