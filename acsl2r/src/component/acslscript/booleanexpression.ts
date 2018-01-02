import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { ExpressionBase } from './expressionbase';

export default class BooleanExpression extends ExpressionBase
{
  constructor(value: string)
  {
    super();
    this._value = value;
  }

  toCode(lang: string, prec: Prec)
  {
    return this._value == "__true" ? "T" : "F";
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
    let expression = new BooleanExpression(this._value);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _value: string;
}
