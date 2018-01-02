import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class StepExpression extends ExpressionBase
{
  constructor(tz: IExpression)
  {
    super();
    this.set("tz", tz);
  }

  toCode(lang: string, prec: Prec): string
  {
    return "tzstep(t, " + this.get("tz").toCode("R", Prec.Step) + ")"; 
  }

  get symbols()
  {
    return this.get("tz").symbols;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("tz"), typeDictionary);
    if (!!replacement) this.set("tz", replacement);
  }

  clone()
  {
    let expression = new StepExpression(null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
