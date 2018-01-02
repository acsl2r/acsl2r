import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class IntegExpression extends ExpressionBase
{
  constructor(id: IExpression, value: IExpression)
  {
    super();
    this.set("id", id);
    this.set("value", value);
  }

  toCode(lang: string, prec: Prec): string
  {
    throw new Error("transliterating INTEG");
  }

  get symbols()
  {
    return this.get("id").symbols.concat(this.get("value").symbols);
  }

  get id(): IExpression
  {
    return this.get("id");
  }

  get value(): IExpression
  {
    return this.get("value");
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("value"), typeDictionary);
    if (!!replacement) this.set("value", replacement);
  }

  clone()
  {
    let expression = new IntegExpression(null, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
