import AcslProgram from '../acslscript/acslprogram';
import { template as loTemplate } from 'lodash';
import { ICodeBlock } from '../../interface';
import { unitIndent, codeBlockToCode } from '../rscript/format';

let assignParametersSrc = require<string>("../../template/assignparameters.tmpl");
let tmplAssignParameters = loTemplate(assignParametersSrc);

export function generateAssignParametersRScript(acslProgram: AcslProgram, configureForRVis: boolean, parameterAssignments: ICodeBlock[])
{
  let parameterAssignmentData =
    parameterAssignments.map(pa => codeBlockToCode(pa, unitIndent, configureForRVis));
  let assignParameters = tmplAssignParameters({
    parameterAssignmentData: parameterAssignmentData
  });

  return assignParameters;
}
