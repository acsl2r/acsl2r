import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import IdExpression from './idexpression';
import { ExpressionBase } from './expressionbase';

let tExpression = new IdExpression("t");

export default class TExpression extends ExpressionBase
{
  constructor()
  {
    super();
  }

  toCode(lang: string, prec: Prec)
  {
    return tExpression.toCode(lang, prec);
  }

  get symbols()
  {
    return [this];
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
  }

  clone()
  {
    let expression = new TExpression();
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}