import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

let rInfixes =
  {
    __and: "&&",
    __eq: "==",
    __ge: ">=",
    __gt: ">",
    __le: "<=",
    __lt: "<",
    __ne: "!=",
    __or: "||",
    __at: "=="
  };

export default class InfixExpression extends ExpressionBase
{
  constructor(operand1: IExpression, infix: string, operand2: IExpression)
  {
    super();
    this.set("operand1", operand1);
    this._infix = infix;
    this.set("operand2", operand2);
  }

  toCode(lang: string, prec: Prec): string
  {
    let wrap = prec != Prec.Sub && prec > Prec.Infix;
    let code: string;
    if (this._infix == "__xor")
    {
      code = "bitwXor(" + this.get("operand1").toCode(lang, Prec.Infix) + ", " + this.get("operand2").toCode(lang, Prec.Infix) + ")";
    }
    else
    {
      code = this.get("operand1").toCode(lang, Prec.Infix) + " " + (rInfixes[this._infix] || this._infix) + " " + this.get("operand2").toCode(lang, Prec.Infix);
    }
    return wrap ? "(" + code + ")" : code;
  }

  get symbols()
  {
    return this.get("operand1").symbols.concat(this.get("operand2").symbols);
  }

  get lhs(): IExpression
  {
    return this.get("operand1");
  }

  get infix(): string
  {
    return this._infix;
  }

  get rhs(): IExpression
  {
    return this.get("operand2");
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
    let expression = new InfixExpression(null, this._infix, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }

  private _infix: string; 
}
