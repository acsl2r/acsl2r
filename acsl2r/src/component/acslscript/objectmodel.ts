import { ICodeBlock, IExpression, IStatement } from '../../interface';
import AcslProgram from './acslprogram';
import Statement from './statement';
import TableStatement from './tablestatement';
import ArrayStatement from './arraystatement';
import ArrayExpression from './arrayexpression';
import FnExpression from './fnexpression';
import IdExpression from './idexpression';
import IfSection from './ifsection';
import ProceduralSection from './proceduralsection';
import DoContinueSection from './docontinuesection';
import { flatten as loFlatten, partition as loPartition } from 'lodash';
import { AcslType } from '../../enum';

export function replaceSymbol(expression: IExpression, symbol: string, replacement: IExpression)
{
  let expressions = expression.expressions;
  for (let name in expressions)
  {
    let asCode = expressions[name].expression.toCode("R", 0);
    if (asCode == symbol)
    {
      expressions[name].expression = replacement;
    }
    else
    {
      replaceSymbol(expressions[name].expression, symbol, replacement);
    }
  }
}

export function getDiscreteSymbolsRequiredByDerivative(acslProgram: AcslProgram)
{
  let symbolsProvided = new Set<string>();
  acslProgram.dynamicSection.discreteSections.forEach(
    ds => ds.codeBlocks.forEach(
      c => c.symbolsProvided.forEach(s => symbolsProvided.add(s.toCode("R", 0)))
    ));
  let symbolsRequired = new Set<string>();
  acslProgram.dynamicSection.derivativeSection.codeBlocks.forEach(cb => cb.symbolsRequired.forEach(s => symbolsRequired.add(s.toCode("R", 0))));

  let discreteSymbols = new Set<string>();
  Array.from(symbolsProvided).filter(s => symbolsRequired.has(s)).forEach(s => discreteSymbols.add(s));

  return discreteSymbols;
}

function isSymbolSource(codeBlock: ICodeBlock, symbolToLower: string): codeBlock is Statement | TableStatement
{
  if ((isStatement(codeBlock) || isTableStatement(codeBlock)) && !!codeBlock.lvalue)
  {
    let lvalueToLower = codeBlock.lvalue.toCode("R", 0).toLowerCase();
    return lvalueToLower == symbolToLower;
  }
  return false;
}

function findSymbolProviderRec(codeBlock: ICodeBlock, symbolToLower: string): Statement | TableStatement
{
  if (isSymbolSource(codeBlock, symbolToLower)) return codeBlock;

  for (let i = 0; i < codeBlock.codeBlocks.length; ++i)
  {
    let symbolSource = findSymbolProviderRec(codeBlock.codeBlocks[i], symbolToLower);
    if (!!symbolSource) return symbolSource;
  }

  return null;
}

export function findSymbolProvider(codeBlock: ICodeBlock, symbol: IdExpression)
{
  return findSymbolProviderRec(codeBlock, symbol.toCode("R", 0).toLowerCase());
}

export function applyAcslTypesToExpression(expression: IExpression, typeDictionary: Map<string, AcslType>): IExpression
{
  expression.applyAcslTypes(typeDictionary);

  if (expression instanceof FnExpression)
  {
    let name = expression.name.toCode("R", 0);

    if (typeDictionary.has(name))
    {
      let arrayExpression = new ArrayExpression(expression.name, expression.args);
      return arrayExpression;
    }
  }

  return null;
}

export function isStatement(obj: ICodeBlock): obj is Statement
{
  return obj instanceof Statement;
}

export function isArrayStatement(obj: ICodeBlock): obj is ArrayStatement
{
  return obj instanceof ArrayStatement;
}

export function isTableStatement(obj: ICodeBlock): obj is TableStatement
{
  return obj instanceof TableStatement;
}

export function isIfSection(obj: ICodeBlock): obj is IfSection
{
  return obj instanceof IfSection;
}

export function isDoContinueSection(obj: ICodeBlock): obj is DoContinueSection
{
  return obj instanceof DoContinueSection;
}

export function isProceduralSection(obj: ICodeBlock): obj is ProceduralSection
{
  return obj instanceof ProceduralSection;
}

export function getSymbolsRequired(symbolsProvided: IExpression[], codeBlocks: ICodeBlock[])
{
  let locals = symbolsProvided.map(s => s.toCode("R", 0));
  let symbolsInScope = new Set(locals);
  let symbolsRequiredAA = codeBlocks.map(s => s.symbolsRequired);
  let symbolsRequired = loFlatten(symbolsRequiredAA);
  let map = symbolsRequired.map(e => ({ symbol: e.toCode("R", 0), expression: e }));
  let notInscope = map.filter(e => !symbolsInScope.has(e.symbol));
  let required = notInscope.map(e => e.expression);
  return required;
}

export function getSymbolsProvided(codeBlocks: ICodeBlock[])
{
  let symbolsProvidedAA = codeBlocks.map(cb => cb.symbolsProvided);
  let symbolsProvided = loFlatten(symbolsProvidedAA);
  return symbolsProvided;
}

interface ISymbolSource
{
  codeBlock: ICodeBlock;
  symbolsProvided: string[];
  symbolsRequired: string[];
}

function _checkResolvedInProcedurals(symbols: Set<string>, codeBlocks: ICodeBlock[])
{
  let symbolsInScope = new Set<string>(symbols);

  for (let i = 0; i < codeBlocks.length; ++i)
  {
    let codeBlock = codeBlocks[i];

    if (isProceduralSection(codeBlock))
    {
      for (let j = 0; j < codeBlock.codeBlocks.length; ++j)
      {
        let childCodeBlock = codeBlock.codeBlocks[j];
        let childSymbolsRequired = childCodeBlock.symbolsRequired;
        let symbolsRequired = childSymbolsRequired.map(s => s.toCode("R", 0));
        let notInScope = new Set<string>(symbolsRequired.filter(s => !symbolsInScope.has(s)));
        if (0 == notInScope.size)
        {
          let childSymbolsProvided = childCodeBlock.symbolsProvided;
          let symbolsProvided = childSymbolsProvided.map(s => s.toCode("R", 0));
          symbolsProvided.forEach(s => symbolsInScope.add(s));
        }
        else
        {
          return notInScope;
        }
      }
    }
    else
    {
      let symbolsProvided = codeBlock.symbolsProvided;
      symbolsProvided.forEach(s => symbolsInScope.add(s.toCode("R", 0)));
    }
  }

  return null;
}

function _orderComputations(symbols: Set<string>, codeBlocks: ICodeBlock[])
{
  let symbolSources: ISymbolSource[] = codeBlocks.map(c =>
  {
    return {
      codeBlock: c,
      symbolsProvided: c.symbolsProvided.map(e => e.toCode("R", 0)),
      symbolsRequired: c.symbolsRequired.map(e => e.toCode("R", 0))
    };
  });

  let pending: ISymbolSource[] = [];
  let reordered: ISymbolSource[] = [];

  let symbolsInScope = new Set<string>(symbols);

  while (symbolSources.length > 0)
  {
    let symbolSource = symbolSources.shift();
    let notInScope = symbolSource.symbolsRequired.filter(s => !symbolsInScope.has(s));
    if (0 == notInScope.length)
    {
      reordered.push(symbolSource);
      symbolSource.symbolsProvided.forEach(s => symbolsInScope.add(s));
    }
    else
    {
      pending.push(symbolSource);
    }
  }

  while (pending.length > 0)
  {
    let toInsert = pending;
    pending = [];
    let notInScope: Set<string>;

    for (let i = 0; i < toInsert.length; ++i)
    {
      let symbolSource = toInsert[i];
      symbolsInScope = new Set<string>(symbols);

      for (let j = 0; j < reordered.length; ++j)
      {
        let current = reordered[j];
        current.symbolsProvided.forEach(s => symbolsInScope.add(s));
        notInScope = new Set<string>(symbolSource.symbolsRequired.filter(s => !symbolsInScope.has(s)));
        if (0 == notInScope.size)
        {
          reordered.splice(j + 1, 0, symbolSource);
          symbolSource = null;
          break;
        }
      }

      if (!!symbolSource)
      {
        pending.push(symbolSource);
      }
    }

    if (pending.length == toInsert.length)
    {
      if (null == notInScope)
      {
        notInScope = new Set<string>();
        pending.forEach(p =>
        {
          let symbolsRequired = p.symbolsRequired;
          symbolsRequired.filter(s => !symbols.has(s)).forEach(s => notInScope.add(s));
        });
      }
      return notInScope;
    }
  }

  codeBlocks.length = 0;
  codeBlocks.push(...reordered.map(ss => ss.codeBlock));
  return null;
}

function stripOutProceduralsRec(codeBlock: ICodeBlock)
{
  let strippedOut: ICodeBlock[] = [];
  let codeBlocks = codeBlock.codeBlocks;

  for (let i = 0; i < codeBlocks.length; ++i)
  {
    let childCodeBlock = codeBlocks[i];
    if (isProceduralSection(childCodeBlock))
    {
      strippedOut.push(...childCodeBlock.codeBlocks);
    }
    else
    {
      stripOutProceduralsRec(childCodeBlock);
      strippedOut.push(childCodeBlock);
    }
  }

  codeBlock.codeBlocks.length = 0;
  codeBlock.codeBlocks.push(...strippedOut);
}

function stripOutProcedurals(codeBlocks: ICodeBlock[])
{
  let strippedOut: ICodeBlock[] = [];

  for (let i = 0; i < codeBlocks.length; ++i)
  {
    let codeBlock = codeBlocks[i];
    if (isProceduralSection(codeBlock))
    {
      codeBlock.codeBlocks.forEach(cb => stripOutProceduralsRec(cb));
      strippedOut.push(...codeBlock.codeBlocks);
    }
    else
    {
      stripOutProceduralsRec(codeBlock);
      strippedOut.push(codeBlock);
    }
  }

  return strippedOut;
}

function findAndOrderConditionalSectionsRec(symbols: Set<string>, codeBlocks: ICodeBlock[], messages: string[], sectionName: string)
{
  let symbolSources: ISymbolSource[] = codeBlocks.map(c =>
  {
    return {
      codeBlock: c,
      symbolsProvided: c.symbolsProvided.map(e => e.toCode("R", 0)),
      symbolsRequired: c.symbolsRequired.map(e => e.toCode("R", 0))
    };
  });

  let pending: ISymbolSource[] = [];
  let reordered: ISymbolSource[] = [];

  let symbolsInScope = new Set<string>(symbols);

  symbolSources.forEach(ss =>
  {
    if (ss.codeBlock instanceof IfSection)
    {
      ss.codeBlock.conditionalSections.forEach(cs =>
      {
        let grouped = loPartition(cs.codeBlocks, c => isStatement(c) && c.isConstant);
        let parameterAssignments = grouped[0] as IStatement[];
        let computations = grouped[1] as IStatement[];

        parameterAssignments.forEach(pa => symbolsInScope.add(pa.lvalue.toCode("R", 0)));

        let reordered = _orderSection(symbolsInScope, computations, messages, sectionName);
        if (!!reordered)
        {
          findAndOrderConditionalSectionsRec(symbols, computations, messages, sectionName);
          cs.codeBlocks.length = 0;
          cs.codeBlocks.push(...parameterAssignments);
          cs.codeBlocks.push(...reordered);
        }
      });
    }

    ss.symbolsProvided.forEach(s => symbolsInScope.add(s));
  });
}

function _orderSection(symbols: Set<string>, computations: ICodeBlock[], messages: string[], sectionName: string)
{
  let unresolved = _orderComputations(symbols, computations);

  if (!unresolved)
  {
    unresolved = _checkResolvedInProcedurals(symbols, computations);
  }

  if (!!unresolved)
  {
    let message = "Sorting failure in " + sectionName + ". One or more symbols not resolved: " + Array.from(unresolved).join(", ");
    messages.push(message);
    computations = stripOutProcedurals(computations);
    unresolved = _orderComputations(symbols, computations);
    if (!unresolved)
    {
      message = "Stripped out ALL PROCEDURALs to resolve issue. Review the changes carefully!";
      messages.push(message);
    }
  }

  return !!unresolved ? null : computations;
}

export function orderComputations(acslProgram: AcslProgram)
{
  let messages: string[] = [];

  let grouped = loPartition(acslProgram.initialSection.codeBlocks, c => isStatement(c) && c.isConstant);
  let parameterAssignments = grouped[0] as IStatement[];
  let computations = grouped[1];

  let symbolsProvided: IExpression[] = [];
  parameterAssignments.forEach(pa => symbolsProvided.push(...pa.symbolsProvided));
  acslProgram.codeBlocks.forEach(c => symbolsProvided.push(...c.symbolsProvided));
  acslProgram.dynamicSection.codeBlocks.forEach(c => symbolsProvided.push(...c.symbolsProvided));
  let symbols = new Set<string>(symbolsProvided.map(ia => ia.toCode("R", 0)));

  let reordered = _orderSection(symbols, computations, messages, "INITIAL");
  findAndOrderConditionalSectionsRec(symbols, computations, messages, "INITIAL");

  if (!!reordered)
  {
    acslProgram.initialSection.codeBlocks.length = 0;
    acslProgram.initialSection.codeBlocks.push(...parameterAssignments);
    acslProgram.initialSection.codeBlocks.push(...reordered);
  }

  computations.forEach(c => c.symbolsProvided.forEach(s => symbols.add(s.toCode("R", 0))));
  acslProgram.dynamicSection.derivativeSection.integs.forEach(i => i.symbolsProvided.forEach(s => symbols.add(s.toCode("R", 0))));
  symbols.add("t");

  let discreteSymbols = getDiscreteSymbolsRequiredByDerivative(acslProgram);
  discreteSymbols.forEach(ds => symbols.add(ds));

  acslProgram.dynamicSection.discreteSections.forEach(ds =>
  {
    grouped = loPartition(ds.codeBlocks, c => isStatement(c) && c.isConstant);
    parameterAssignments = grouped[0] as IStatement[];
    computations = grouped[1] as IStatement[];

    let symbolsForDS = new Set<string>(Array.from(symbols));
    parameterAssignments.forEach(pa => symbolsForDS.add(pa.lvalue.toCode("R", 0)));

    reordered = _orderSection(symbols, computations, messages, "DISCRETE=" + ds.name);
    findAndOrderConditionalSectionsRec(symbols, computations, messages, "DISCRETE=" + ds.name);

    if (!!reordered)
    {
      ds.codeBlocks.length = 0;
      ds.codeBlocks.push(...parameterAssignments);
      ds.codeBlocks.push(...reordered);
    }
  });

  grouped = loPartition(acslProgram.dynamicSection.derivativeSection.codeBlocks, c => isStatement(c) && c.isConstant);
  parameterAssignments = grouped[0] as IStatement[];
  computations = grouped[1] as IStatement[];

  parameterAssignments.forEach(pa => symbols.add(pa.lvalue.toCode("R", 0)));

  reordered = _orderSection(symbols, computations, messages, "DERIVATIVE");
  findAndOrderConditionalSectionsRec(symbols, computations, messages, "DERIVATIVE");

  if (!!reordered)
  {
    acslProgram.dynamicSection.derivativeSection.codeBlocks.length = 0;
    acslProgram.dynamicSection.derivativeSection.codeBlocks.push(...parameterAssignments);
    acslProgram.dynamicSection.derivativeSection.codeBlocks.push(...reordered);
  }

  acslProgram.dynamicSection.derivativeSection.codeBlocks.forEach(c => isStatement(c) && symbols.add(c.lvalue.toCode("R", 0)));

  grouped = loPartition(acslProgram.terminalSection.codeBlocks, c => isStatement(c) && c.isConstant);
  parameterAssignments = grouped[0] as IStatement[];
  computations = grouped[1] as IStatement[];

  parameterAssignments.forEach(pa => pa.symbolsProvided.forEach(s => symbols.add(s.toCode("R", 0))));

  reordered = _orderSection(symbols, computations, messages, "TERMINAL");
  findAndOrderConditionalSectionsRec(symbols, computations, messages, "TERMINAL");

  if (!!reordered)
  {
    acslProgram.terminalSection.codeBlocks.length = 0;
    acslProgram.terminalSection.codeBlocks.push(...parameterAssignments);
    acslProgram.terminalSection.codeBlocks.push(...reordered);
  }

  return 0 == messages.length ? null : messages;
}
