import { AcslType, Prec } from '../../enum';
import { IExpression } from '../../interface';
import { applyAcslTypesToExpression } from './objectmodel';
import { ExpressionBase } from './expressionbase';
import IdExpression from './idexpression';

export default class FnExpression extends ExpressionBase
{
  constructor(name: IdExpression, args: IExpression[])
  {
    super();
    this.set("name", name);
    this._nargs = args.length;
    for (let i = 0; i < this._nargs; ++i)
    {
      this.set("arg" + i, args[i]);
    }
  }

  get name()
  {
    return this.get("name") as IdExpression;
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

  toCode(lang: string, prec: Prec)
  {
    let fn = this.name.toCode("R", 0).toLowerCase();
    switch (fn)
    {
      case "int":
        fn = "as.integer";
        break;
    }
    let args = this.args.map(a => a.toCode("R", Prec.Fn));
    let code = fn + "(" + args.join(", ") + ")";
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

  clone()
  {
    let expression = new FnExpression(this.name.clone(), this.args.map(a => a.clone()));
    return expression;
  }

  private _nargs: number; 
}
