import { IExpression } from '../../interface';
import InitialSection from './initialsection';
import DynamicSection from './dynamicsection';
import TerminalSection from './terminalsection';
import { SectionBase } from './sectionbase';
import { AcslType } from '../../enum';

export default class AcslProgram extends SectionBase
{
  constructor()
  {
    super("acslprogram");
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

  get initialSection()
  {
    return this._initialSection;
  }

  get dynamicSection()
  {
    return this._dynamicSection;
  }

  get terminalSection()
  {
    return this._terminalSection;
  }

  get typeDictionary()
  {
    return this._typeDictionary;
  }

  get nonNativeExpressions()
  {
    return this._nonNativeExpressions;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    this.applyAcslTypesToCodeBlocks(typeDictionary);
    this.initialSection.applyAcslTypes(typeDictionary);
    this._dynamicSection.applyAcslTypes(typeDictionary);
    this._terminalSection.applyAcslTypes(typeDictionary);
  }

  private _initialSection = new InitialSection();
  private _dynamicSection = new DynamicSection();
  private _terminalSection = new TerminalSection();
  private _typeDictionary = new Map<string, AcslType>();
  private _nonNativeExpressions: IExpression[] = [];
}
