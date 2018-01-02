import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class SubExpression extends ExpressionBase
{
  constructor(expression: IExpression)
  {
    super();
    this.set("expression", expression);
  }

  toCode(lang: string, prec: Prec)
  {
    return "(" + this.get("expression").toCode("R", Prec.Sub) + ")";
  }

  get symbols()
  {
    return this.get("expression").symbols;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("expression"), typeDictionary);
    if (!!replacement) this.set("expression", replacement);
  }

  clone()
  {
    let expression = new SubExpression(null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
