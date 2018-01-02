import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class NotExpression extends ExpressionBase
{
  constructor(operand: IExpression)
  {
    super();
    this.set("operand", operand);
  }

  toCode(lang: string, prec: Prec)
  {
    let wrap = prec != Prec.Sub && prec > Prec.Not;
    let code = "!" + this.get("operand").toCode(lang, Prec.Not);
    return wrap ? "(" + code + ")" : code;
  }

  get symbols()
  {
    return this.get("operand").symbols;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("operand"), typeDictionary);
    if (!!replacement) this.set("operand",  replacement);
  }

  clone()
  {
    let expression = new NotExpression(null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
