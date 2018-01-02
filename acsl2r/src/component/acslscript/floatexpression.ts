import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { ExpressionBase } from './expressionbase';

export default class FloatExpression extends ExpressionBase
{
  constructor(float: number)
  {
    super();
    this._float = float;
  }

  get float()
  {
    return this._float;
  }

  toCode(lang: string, prec: Prec)
  {
    return this._float.toString();
  }

  get symbols()
  {
    return [];
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
  }

  clone()
  {
    let expression = new FloatExpression(this._float);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _float: number;
}
