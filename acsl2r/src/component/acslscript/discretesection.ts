import { AcslType } from '../../enum';
import { IExpression, IStatement } from '../../interface';
import { SectionBase } from './sectionbase';
import { isStatement, getSymbolsRequired, getSymbolsProvided } from './objectmodel';
import InfixExpression from './infixexpression';

export default class DiscreteSection extends SectionBase
{
  constructor()
  {
    super("discrete");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    let symbolsProvided = this.symbolsProvided;
    let required = getSymbolsRequired(symbolsProvided, this.codeBlocks);
    return required;
  }

  get symbolsProvided(): IExpression[]
  {
    let symbolsProvided = getSymbolsProvided(this.codeBlocks);
    return symbolsProvided;
  }

  get name()
  {
    return this._name;
  }

  set name(value: string)
  {
    this._name = value;
  }

  get intervalAssignment()
  {
    return this._intervalAssignment;
  }

  set intervalAssignment(value: IStatement)
  {
    this._intervalAssignment = value;
  }

  get schedules()
  {
    return this._schedules;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    !!this._intervalAssignment && this._intervalAssignment.applyAcslTypes(typeDictionary);
    this._schedules.forEach(s => s.applyAcslTypes(typeDictionary));
  }

  private _name: string;
  private _intervalAssignment: IStatement;
  private _schedules: InfixExpression[] = [];
}
