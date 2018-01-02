import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class PulseExpression extends ExpressionBase
{
  constructor(tz: IExpression, p: IExpression, w: IExpression)
  {
    super();
    this.set("tz", tz);
    this.set("p", p);
    this.set("w", w);
  }

  toCode(lang: string, prec: Prec): string
  {
    return "pulse(t, " + this.get("tz").toCode("R", Prec.Pulse) + ", " + this.get("p").toCode("R", Prec.Pulse) + ", " + this.get("w").toCode("R", Prec.Pulse) + ")"; 
  }

  get symbols()
  {
    return this.get("tz").symbols.concat(this.get("p").symbols, this.get("w").symbols);
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("tz"), typeDictionary);
    if (!!replacement) this.set("tz", replacement);
    replacement = applyAcslTypesToExpression(this.get("p"), typeDictionary);
    if (!!replacement) this.set("p", replacement);
    replacement = applyAcslTypesToExpression(this.get("w"), typeDictionary);
    if (!!replacement) this.set("w", replacement);
  }

  clone()
  {
    let expression = new PulseExpression(null, null, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
