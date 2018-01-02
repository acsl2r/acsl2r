import { AcslType, Prec, CommentPlacement } from '../../enum';
import { IExpression, IComment, IStatement } from '../../interface';

export default class TableStatement implements IStatement
{
  constructor(name: IExpression, independent: IExpression[], dependent: IExpression[])
  {
    this._name = name;
    this._independent = independent;
    this._dependent = dependent;
  }

  get codeBlocks()
  {
    return [];
  }

  toCode(lang: string)
  {
    let independents = this._independent.map(i => i.toCode("R", 0));
    let independent = independents.join(", ");
    let dependents = this._dependent.map(i => i.toCode("R", 0));
    let dependent = dependents.join(", ");
    let code = this._name.toCode(lang, 0) + " <- approxfun(c(" + independent + "), c(" + dependent + "))";
    return code;
  }

  get lvalue(): IExpression
  {
    return this._name;
  }

  get computation(): IExpression
  {
    throw new Error("Trying to access computation of table declaration");
  }

  get isConstant(): boolean
  {
    return false;
  }

  get comments()
  {
    return this._comments;
  }

  get symbolsRequired()
  {
    return [];
  }

  get symbolsProvided()
  {
    return [this._name];
  }

  getContentComments()
  {
    return this.comments.filter(c => c.placement == CommentPlacement.Content);
  }

  getLineComments()
  {
    return this.comments.filter(c => c.placement == CommentPlacement.Line);
  }

  getEndLineComments()
  {
    return this.comments.filter(c => c.placement == CommentPlacement.EndLine);
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
  }

  private _name: IExpression;
  private _independent: IExpression[];
  private _dependent: IExpression[];
  private _comments: IComment[] = [];
}
