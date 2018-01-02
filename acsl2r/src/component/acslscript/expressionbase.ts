import { AcslType, Prec } from './../../enum';
import { IExpression, IExpressionEntry } from '../../interface';

export abstract class ExpressionBase implements IExpression
{
  abstract toCode(lang: string, prec: Prec): string;
  abstract symbols: IExpression[];
  abstract applyAcslTypes(typeDictionary: Map<string, AcslType>);
  abstract clone(): IExpression;

  get expressions()
  {
    return this._expressions;
  }

  protected set(name: string, expression: IExpression)
  {
    this._expressions[name] = {
      expression: expression
    };
  }

  protected get(name: string)
  {
    let expressionEntry = this._expressions[name]
    if (null == expressionEntry) return null;
    return expressionEntry.expression;
  }

  protected cloneExpressionsFrom(src: ExpressionBase)
  {
    let expressions: { [name: string]: IExpressionEntry } = {};
    for (let name in src.expressions)
    {
      let expression = src.expressions[name].expression.clone();
      expressions[name] = {
        expression: expression
      };
    }
    this._expressions = expressions;
  }

  private _expressions: { [name: string]: IExpressionEntry } = {};
}
