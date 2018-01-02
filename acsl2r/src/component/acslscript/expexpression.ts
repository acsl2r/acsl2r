import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class ExpExpression extends ExpressionBase
{
  constructor(operand1: IExpression, operand2: IExpression)
  {
    super();
    this.set("operand1", operand1);
    this.set("operand2", operand2);
  }

  toCode(lang: string, prec: Prec)
  {
    let wrap = prec != Prec.Sub && prec > Prec.Exp;
    let code = this.get("operand1").toCode(lang, Prec.Exp) + " ^ " + this.get("operand2").toCode(lang, Prec.Exp);
    return wrap ? "(" + code + ")" : code;
  }

  get symbols()
  {
    return this.get("operand1").symbols.concat(this.get("operand2").symbols);
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("operand1"), typeDictionary);
    if (!!replacement) this.set("operand1", replacement);
    replacement = applyAcslTypesToExpression(this.get("operand2"), typeDictionary);
    if (!!replacement) this.set("operand2", replacement);
  }

  clone()
  {
    let expression = new ExpExpression(null, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
