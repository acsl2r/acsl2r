import { Prec, CommentPlacement, AcslType } from '../../enum';
import { IExpression, IComment, IStatement } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';

export default class ArrayStatement implements IStatement
{
  constructor(name: IExpression, acslType: AcslType, dimensions: IExpression[])
  {
    this._name = name;
    this._acslType = acslType;
    this._dimensions = dimensions;
  }

  get codeBlocks()
  {
    return [];
  }

  private static acslTypeToRType(acslType: AcslType)
  {
    switch (acslType)
    {
      case AcslType.Character:
        return "character";

      case AcslType.Dimension:
      case AcslType.DoublePrecision:
      case AcslType.Real:
        return "double";

      case AcslType.Integer:
        return "integer";

      case AcslType.Logical:
        return "logical";

      default: throw new Error("Unhandled AcslType: " + acslType);
    }
  }

  toCode(lang: string)
  {
    let dimensions = this._dimensions.map(i => i.toCode("R", 0));
    let rType = ArrayStatement.acslTypeToRType(this._acslType);
    let code: string;
    if (1 == dimensions.length)
    {
      code = this._name.toCode("R", 0) + " <- " + rType + "(" + dimensions + ")";
    }
    else
    {
      code = this._name.toCode("R", 0) + " <- array(" + rType + "(1), c(" + dimensions.join(",") + "))"; 
    }
    return code;
  }

  get lvalue(): IExpression
  {
    return this._name;
  }

  get computation(): IExpression
  {
    throw new Error("Trying to access computation of array declaration");
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
    for (let i = 0; i < this._dimensions.length; ++i)
    {
      let replacement = applyAcslTypesToExpression(this._dimensions[i], typeDictionary);
      if (!!replacement) this._dimensions[i] = replacement;
    }
  }

  private _name: IExpression;
  private _dimensions: IExpression[];
  private _acslType: AcslType;
  private _comments: IComment[] = [];
}
