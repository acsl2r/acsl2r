import { AcslType } from '../../enum';
import { IExpression, IStatement } from '../../interface';
import { SectionBase } from './sectionbase';
import { isStatement } from './objectmodel';
import InfixExpression from './infixexpression';

export default class InitialSection extends SectionBase
{
  constructor()
  {
    super("initial");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    return [];
  }

  get symbolsProvided(): IExpression[]
  {
    let codeBlocks = this.codeBlocks;
    let statements = codeBlocks.filter(cb => isStatement(cb)) as IStatement[];
    let symbols = [];
    statements.forEach(s => symbols.push(...s.symbolsProvided));
    return symbols;
  }

  get schedules()
  {
    return this._schedules;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    this._schedules.forEach(s => s.applyAcslTypes(typeDictionary));
  }

  private _schedules: InfixExpression[] = [];
}
