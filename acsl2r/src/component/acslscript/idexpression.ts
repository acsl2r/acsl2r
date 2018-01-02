import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { ExpressionBase } from './expressionbase';

export default class IdExpression extends ExpressionBase
{
  constructor(id: string)
  {
    super();
    this._id = id;
  }

  toCode(lang: string, prec: Prec)
  {
    return this._id;
  }

  get symbols()
  {
    return [this];
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
  }

  reviseId(definition: string)
  {
    if (definition.toLowerCase() == this._id.toLowerCase() && definition != this._id)
    {
      let original = this._id;
      this._id = definition;
      return original;
    }

    return null;
  }

  clone()
  {
    let expression = new IdExpression(this._id);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _id: string;
}