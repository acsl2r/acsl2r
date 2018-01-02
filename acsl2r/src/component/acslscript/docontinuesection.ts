import { AcslType } from '../../enum';
import { IExpression } from '../../interface';
import { SectionBase } from './sectionbase';
import InfixExpression from './infixexpression';
import { getSymbolsRequired, getSymbolsProvided } from './objectmodel';

export default class DoContinueSection extends SectionBase
{
  constructor()
  {
    super("docontinue");
  }

  toCode(lang: string): string
  {
    throw new Error("Not implemented");
  }

  get symbolsRequired(): IExpression[]
  {
    let symbolsProvided = this.symbolsProvided;
    !!this._index && symbolsProvided.push(this._index);
    let required = getSymbolsRequired(symbolsProvided, this.codeBlocks);
    return required;
  }

  get symbolsProvided(): IExpression[]
  {
    let symbolsProvided = getSymbolsProvided(this.codeBlocks);
    return symbolsProvided;
  }

  get label()
  {
    return this._label;
  }

  set label(value: IExpression)
  {
    this._label = value;
  }

  get index()
  {
    return this._index;
  }

  set index(value: IExpression)
  {
    this._index = value;
  }

  get initial()
  {
    return this._initial;
  }

  set initial(value: IExpression)
  {
    this._initial = value;
  }

  get terminal()
  {
    return this._terminal;
  }

  set terminal(value: IExpression)
  {
    this._terminal = value;
  }

  get increment()
  {
    return this._increment;
  }

  set increment(value: IExpression)
  {
    this._increment = value;
  }

  get schedules()
  {
    return this._schedules;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    !!this._label && this._label.applyAcslTypes(typeDictionary);
    !!this._index && this._index.applyAcslTypes(typeDictionary);
    !!this._initial && this._initial.applyAcslTypes(typeDictionary);
    !!this._terminal && this._terminal.applyAcslTypes(typeDictionary);
    !!this._increment && this._increment.applyAcslTypes(typeDictionary);
    this._schedules.forEach(s => s.applyAcslTypes(typeDictionary));
  }

  private _label: IExpression;
  private _index: IExpression;
  private _initial: IExpression;
  private _terminal: IExpression;
  private _increment: IExpression;
  private _schedules: InfixExpression[] = [];
}
