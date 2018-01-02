import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class AddSubExpression extends ExpressionBase
{
  constructor(operand1: IExpression, op: string, operand2: IExpression)
  {
    super();
    this.set("operand1", operand1);
    this._op = op;
    this.set("operand2", operand2);
  }

  toCode(lang: string, prec: Prec)
  {
    let wrap = prec != Prec.Sub && prec > Prec.AddSub;
    let code = this.get("operand1").toCode(lang, Prec.AddSub) + " " + this._op + " " + this.get("operand2").toCode(lang, Prec.AddSub);
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
    let expression = new AddSubExpression(null, this._op, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _op: string; 
}
