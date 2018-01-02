import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { ExpressionBase } from './expressionbase';

export default class StringExpression extends ExpressionBase
{
  constructor(str: string)
  {
    super();
    this._str = str;
  }

  toCode(lang: string, prec: Prec)
  {
    return this._str.replace(/'/g, "\"");
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
    let expression = new StringExpression(this._str);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _str: string;
}
