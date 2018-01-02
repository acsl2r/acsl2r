import { Prec, CommentPlacement, AcslType } from '../../enum';
import { IExpression, IComment, IStatement } from '../../interface';
import FloatExpression from './floatexpression';
import BooleanExpression from './booleanexpression';
import IdExpression from './idexpression';
import { applyAcslTypesToExpression } from './objectmodel';

export default class Statement implements IStatement
{
  constructor(lvalue: IExpression, computation: IExpression)
  {
    this._lvalue = lvalue;
    this._computation = computation;
  }

  get codeBlocks()
  {
    return [];
  }

  toCode(lang: string)
  {
    let computation = this._computation.toCode(lang, Prec.Assign);

    if (!!this._acslType)
    {
      if (this._computation instanceof FloatExpression || this._computation instanceof BooleanExpression || this._computation instanceof IdExpression)
      {
        switch (this._acslType)
        {
          case AcslType.Character:
            computation = "as.character(" + computation + ")";
            break;

          case AcslType.DoublePrecision:
          case AcslType.Real:
            computation = "as.double(" + computation + ")";
            break;

          case AcslType.Integer:
            computation = "as.integer(" + computation + ")";
            break;

          case AcslType.Logical:
            computation = "as.logical(" + computation + ")";
            break;
        }
      }
    }

    return !!this._lvalue ?
      this._lvalue.toCode(lang, Prec.Assign) + " <- " + computation :
      computation;
  }

  get lvalue(): IExpression
  {
    return this._lvalue;
  }

  set lvalue(value: IExpression)
  {
    this._lvalue = value;
  }

  get computation(): IExpression
  {
    return this._computation;
  }

  get isConstant(): boolean
  {
    return this._isConstant;
  }

  set isConstant(value: boolean)
  {
    this._isConstant = value;
  }

  get acslType()
  {
    return this._acslType;
  }

  set acslType(value)
  {
    this._acslType = value;
  }

  get comments()
  {
    return this._comments;
  }

  get symbolsRequired()
  {
    return this._computation.symbols;
  }

  get symbolsProvided()
  {
    return !!this._lvalue ? [this._lvalue] : [];
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
    let replacement = applyAcslTypesToExpression(this._computation, typeDictionary);
    if (!!replacement) this._computation = replacement;
    this._computation.applyAcslTypes(typeDictionary);

    if (!!this._lvalue)
    {
      let name = this.lvalue.toCode("R", 0);
      if (typeDictionary.has(name))
      {
        this.acslType = typeDictionary.get(name);
      }
    }
  }

  private _lvalue: IExpression;
  private _computation: IExpression;
  private _isConstant: boolean = false;
  private _acslType: AcslType;
  private _comments: IComment[] = [];
}
