import DiscreteSection from './discretesection';
import DerivativeSection from './derivativesection';
import { AcslType } from '../../enum';
import { IExpression, IStatement } from '../../interface';
import { SectionBase } from './sectionbase';

export default class DynamicSection extends SectionBase
{
  constructor()
  {
    super("dynamic");
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

  get discreteSections()
  {
    return this._discreteSections;
  }

  get algorithm()
  {
    return this._algorithm;
  }

  set algorithm(value: IStatement)
  {
    this._algorithm = value;
  }

  get maxterval()
  {
    return this._maxterval;
  }

  set maxterval(value: IStatement)
  {
    this._maxterval = value;
  }

  get minterval()
  {
    return this._minterval;
  }

  set minterval(value: IStatement)
  {
    this._minterval = value;
  }

  get cinterval()
  {
    return this._cinterval;
  }

  set cinterval(value: IStatement)
  {
    this._cinterval = value;
  }

  get nsteps()
  {
    return this._nsteps;
  }

  set nsteps(value: IStatement)
  {
    this._nsteps = value;
  }

  get derivativeSection()
  {
    return this._derivativeSection;
  }

  get termt()
  {
    return this._termt;
  }

  set termt(value: IExpression)
  {
    this._termt = value;
  }

  get tStop()
  {
    return this._tStop;
  }

  set tStop(value: IStatement)
  {
    this._tStop = value;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    this._discreteSections.forEach(ds => ds.applyAcslTypes(typeDictionary));
    !!this._algorithm && this._algorithm.applyAcslTypes(typeDictionary);
    !!this._maxterval && this._maxterval.applyAcslTypes(typeDictionary);
    !!this._minterval && this._minterval.applyAcslTypes(typeDictionary);
    !!this._cinterval && this._cinterval.applyAcslTypes(typeDictionary);
    !!this._nsteps && this._nsteps.applyAcslTypes(typeDictionary);
    this._derivativeSection.applyAcslTypes(typeDictionary);
    !!this._termt && this._termt.applyAcslTypes(typeDictionary);
  }

  private _discreteSections: DiscreteSection[] = [];
  private _algorithm: IStatement;
  private _maxterval: IStatement;
  private _minterval: IStatement;
  private _cinterval: IStatement;
  private _nsteps: IStatement;
  private _derivativeSection = new DerivativeSection();
  private _termt: IExpression;
  private _tStop: IStatement;
}
