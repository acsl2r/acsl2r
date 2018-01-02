import { partition as loPartition } from 'lodash';
import AcslProgram from './acslscript/acslprogram';
import Statement from './acslscript/statement';
import InfixExpression from './acslscript/infixexpression';
import IdExpression from './acslscript/idexpression';
import FloatExpression from './acslscript/floatexpression';
import { ICodeBlock, IStatement } from '../interface';
import { isStatement, getDiscreteSymbolsRequiredByDerivative } from './acslscript/objectmodel';
import { generateAssignParametersRScript } from './rscript/assignparameters';
import { generateCalculateVariablesRScript } from './rscript/calculatevariables';
import { generateDerivativeRScript } from './rscript/derivative';
import { generateEventHandlerRScript, processDiscreteSections } from './rscript/eventhandler';
import { generateRunModelRScript } from './rscript/runmodel';
import { generateTerminalRScript } from './rscript/terminal';
import { generateRScript } from './rscript/rscript';

export function generate(acslProgram: AcslProgram, fileName: string, messages: string[], diagnostics: string[], configureForRVis: boolean)
{
  let grouped = loPartition(acslProgram.initialSection.codeBlocks, c => isStatement(c) && c.isConstant);

  let parameterAssignments = grouped[0];
  parameterAssignments.push(...(acslProgram.codeBlocks.filter(c => isStatement(c) && c.isConstant) as IStatement[]));
  parameterAssignments.push(...(acslProgram.dynamicSection.codeBlocks.filter(c => isStatement(c) && c.isConstant) as IStatement[]));
  !!acslProgram.dynamicSection.cinterval && parameterAssignments.push(acslProgram.dynamicSection.cinterval);

  let parameterSymbols = new Set<string>();
  parameterAssignments.forEach(pa => pa.symbolsProvided.forEach(s => parameterSymbols.add(s.toCode("R", 0))));

  let initialComputations = grouped[1];
  let initialComputationSymbols = new Set<string>();
  initialComputations.forEach(c => c.symbolsProvided.forEach(s => initialComputationSymbols.add(s.toCode("R", 0))));

  let assignParameters = generateAssignParametersRScript(acslProgram, configureForRVis, parameterAssignments);

  let calculateVariables = generateCalculateVariablesRScript(acslProgram, initialComputations);

  let integratorEvents = processDiscreteSections(acslProgram, messages);
  let discreteSymbols = getDiscreteSymbolsRequiredByDerivative(acslProgram);

  let { derivative, integAssignments, outputs } = generateDerivativeRScript(acslProgram, messages, parameterSymbols, initialComputationSymbols, discreteSymbols);

  let eventHandler = 0 == integratorEvents.length ? null : generateEventHandlerRScript(integAssignments, integratorEvents);

  let tStopParamName = !!acslProgram.dynamicSection.tStop ? acslProgram.dynamicSection.tStop.lvalue.toCode("R", 0) : null;
  let cIntParamName = !!acslProgram.dynamicSection.cinterval ? acslProgram.dynamicSection.cinterval.lvalue.toCode("R", 0) : null;
  let runModel = generateRunModelRScript(tStopParamName, cIntParamName, integAssignments, integratorEvents);

  let terminal = generateTerminalRScript(acslProgram, outputs);

  let rScript = generateRScript(
    acslProgram,
    fileName,
    messages,
    diagnostics,
    assignParameters,
    calculateVariables,
    derivative,
    eventHandler,
    runModel,
    terminal
  );

  return rScript;
}