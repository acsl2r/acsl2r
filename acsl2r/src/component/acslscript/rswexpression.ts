import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class RswExpression extends ExpressionBase
{
  constructor(test: IExpression, ifTrue: IExpression, ifFalse: IExpression)
  {
    super();
    this.set("test", test);
    this.set("ifTrue", ifTrue);
    this.set("ifFalse", ifFalse);
  }

  toCode(lang: string, prec: Prec): string
  {
    return "ifelse(" + this.get("test").toCode(lang, Prec.Rsw) + ", " + this.get("ifTrue").toCode(lang, Prec.Rsw) + ", " + this.get("ifFalse").toCode(lang, Prec.Rsw) + ")";
  }

  get symbols()
  {
    return this.get("test").symbols.concat(this.get("ifTrue").symbols, this.get("ifFalse").symbols);
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    let replacement = applyAcslTypesToExpression(this.get("test"), typeDictionary);
    if (!!replacement) this.set("test", replacement);
    replacement = applyAcslTypesToExpression(this.get("ifTrue"), typeDictionary);
    if (!!replacement) this.set("ifTrue", replacement);
    replacement = applyAcslTypesToExpression(this.get("ifFalse"), typeDictionary);
    if (!!replacement) this.set("ifFalse", replacement);
  }

  clone()
  {
    let expression = new RswExpression(null, null, null);
    expression.cloneExpressionsFrom(this);
    return expression;
  }
}
