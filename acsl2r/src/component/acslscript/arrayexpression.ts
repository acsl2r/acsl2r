import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';

export default class ArrayExpression extends ExpressionBase
{
  constructor(name: IExpression, args: IExpression[])
  {
    super();
    this._name = name;
    this._nargs = args.length;
    for (let i = 0; i < this._nargs; ++i)
    {
      this.set("arg" + i, args[i]);
    }
  }

  toCode(lang: string, prec: Prec)
  {
    let args = this.args.map(a => a.toCode("R", Prec.Fn));
    let code = this._name.toCode("R", 0) + "[" + args.join(", ") + "]";
    return code;
  }

  get symbols()
  {
    let symbols = [];
    this.args.forEach(a => symbols.push(...a.symbols));
    return symbols;
  }

  applyAcslTypes(typeDictionary: Map<string, AcslType>)
  {
    for (let i = 0; i < this._nargs; ++i)
    {
      let name = "arg" + i;
      let replacement = applyAcslTypesToExpression(this.get(name), typeDictionary);
      if (!!replacement) this.set(name, replacement);
    }
  }

  get args()
  {
    let _args: IExpression[] = [];
    for (let i = 0; i < this._nargs; ++i)
    {
      _args.push(this.get("arg" + i));
    }
    return _args;
  }

  clone()
  {
    let expression = new ArrayExpression(this._name.clone(), this.args.map(a => a.clone()));
    return expression;
  }

  private _name: IExpression;
  private _nargs: number; 
}
