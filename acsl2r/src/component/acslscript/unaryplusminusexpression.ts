import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class UnaryPlusMinusExpression extends ExpressionBase
{
  constructor(op: string, operand: IExpression)
  {
    super();
    this._op = op;
    this.set("operand", operand);
  }

  toCode(lang: string, prec: Prec)
  {
    let wrap = prec != Prec.Sub && prec > Prec.Unary;
    let code = this._op + this.get("operand").toCode(lang, Prec.Unary);
    return wrap ? "(" + code + ")" : code;
  }

  get symbols()
  {
    return this.get("operand").symbols;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("operand"), typeDictionary);
    if (!!replacement) this.set("operand", replacement);
  }

  clone()
  {
    let expression = new UnaryPlusMinusExpression(this._op, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _op: string;
}
