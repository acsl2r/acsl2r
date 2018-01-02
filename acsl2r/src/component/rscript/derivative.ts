import AcslProgram from '../acslscript/acslprogram';
import { template as loTemplate } from 'lodash';
import { CommentPlacement } from '../../enum';
import { unitIndent, codeBlockToCode, generateCommentBlock } from '../rscript/format';
import Statement from '../acslscript/statement';
import IntegExpression from '../acslscript/integexpression';

export interface IIntegAssignment
{
  stateId: string;
  derivativeId: string;
  initialValue: string;
}

let derivativeSrc = require<string>("../../template/derivative.tmpl");
let tmplDerivative = loTemplate(derivativeSrc);

export function generateDerivativeRScript(
  acslProgram: AcslProgram,
  messages: string[],
  parameterSymbols: Set<string>,
  initialComputationSymbols: Set<string>,
  discreteSymbols: Set<string>
)
{
  let integStatements = acslProgram.dynamicSection.derivativeSection.integs as Statement[];
  let integAssignments: IIntegAssignment[] = integStatements.map(s => 
  {
    return {
      stateId: s.lvalue.toCode("R", 0),
      derivativeId: (<IntegExpression>s.computation).id.toCode("R", 0),
      initialValue: (<IntegExpression>s.computation).value.toCode("R", 0)
    }
  });

  let notFromState = new Set<string>();
  discreteSymbols.forEach(s => 
  {
    let isState = integAssignments.some(ia => ia.stateId == s);
    if (!isState) notFromState.add(s);
  });

  if (0 < notFromState.size)
  {
    let list = Array.from(notFromState).join(", ");
    let message = "Adding computations from DISCRETE sections to integrator state: " + list;
    messages.push(message);

    let argsToIntegrator: string[] = [];
    argsToIntegrator.push(...Array.from(parameterSymbols));
    argsToIntegrator.push(...Array.from(initialComputationSymbols));
    let alreadyDefined = argsToIntegrator.filter(a => notFromState.has(a));
    if (0 < alreadyDefined.length)
    {
      list = alreadyDefined.join(", ");
      message = "State set in DISCRETE section also defined elsewhere: " + list;
      messages.push(message);
    }
  }

  notFromState.forEach(s => integAssignments.push({
    stateId: s, derivativeId: "0.0", initialValue: "0.0"
  }));

  let symbolsProvided = new Set<string>();
  acslProgram.dynamicSection.derivativeSection.codeBlocks.forEach(cb => cb.symbolsProvided.forEach(s => symbolsProvided.add(s.toCode("R", 0))));
  integAssignments.forEach(ia => symbolsProvided.delete(ia.derivativeId));
  let outputs = Array.from(symbolsProvided);

  let computationData =
    acslProgram.dynamicSection.derivativeSection.codeBlocks.map(c => codeBlockToCode(c, unitIndent + unitIndent, false));

  let derivativeEndSectionComments =
    generateCommentBlock(acslProgram.dynamicSection.derivativeSection.comments, CommentPlacement.EndSection, "#", unitIndent + unitIndent);

  let derivative = tmplDerivative({
    integAssignments: integAssignments,
    computationData: computationData,
    outputs: outputs,
    derivativeEndSectionComments: derivativeEndSectionComments
  });

  return { derivative, integAssignments, outputs };
}
