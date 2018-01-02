import AcslProgram from '../acslscript/acslprogram';
import { template as loTemplate, partition as loPartition } from 'lodash';
import { CommentPlacement } from '../../enum';
import { ICodeBlock } from '../../interface';
import { unitIndent, codeBlockToCode, generateCommentBlock } from '../rscript/format';
import { isTableStatement, isArrayStatement } from '../acslscript/objectmodel';

let calculateVariablesSrc = require<string>("../../template/calculatevariables.tmpl");
let tmplCalculateVariables = loTemplate(calculateVariablesSrc);

export function generateCalculateVariablesRScript(acslProgram: AcslProgram, computations: ICodeBlock[])
{
  let groups = loPartition(computations, c => isArrayStatement(c) || isTableStatement(c));
  let declarations = groups[0];
  let calculations = groups[1];

  let declarationData =
    declarations.map(c => codeBlockToCode(c, unitIndent + unitIndent, false));
  let calculationData =
    calculations.map(c => codeBlockToCode(c, unitIndent + unitIndent, false));

  let initialEndSectionComments =
    generateCommentBlock(acslProgram.initialSection.comments, CommentPlacement.EndSection, "#", unitIndent + unitIndent);
  let calculateVariables = tmplCalculateVariables({
    computationData: declarationData.concat(calculationData),
    initialEndSectionComments: initialEndSectionComments
  });

  return calculateVariables;
}
