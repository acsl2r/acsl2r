import { AcslType } from './../../enum';
import { IComment, ICodeBlock, IExpression, ISection } from '../../interface';
import { uniqueId as loUniqueId } from 'lodash';

export abstract class SectionBase implements ISection
{
  constructor(typeId: string)
  {
    this._id = loUniqueId(typeId + "$");
  }

  get id()
  {
    return this._id;
  }

  get codeBlocks()
  {
    return this._codeBlocks;
  }

  abstract toCode(lang: string): string;

  get comments()
  {
    return this._comments;
  }

  abstract applyAcslTypes(typeDictionary: Map<string, AcslType>);

  abstract get symbolsRequired(): IExpression[];
  abstract get symbolsProvided(): IExpression[];

  protected applyAcslTypesToCodeBlocks(typeDictionary: Map<string, AcslType>)
  {
    this._codeBlocks.forEach(cb => cb.applyAcslTypes(typeDictionary));
  }

  private _id: string;
  private _codeBlocks: ICodeBlock[] = [];
  private _comments: IComment[] = [];
}
