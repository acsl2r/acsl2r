import * as wordWrap from 'word-wrap';
import AcslProgram from '../acslscript/acslprogram';
import { template as loTemplate } from 'lodash';
import { CommentPlacement } from '../../enum';
import { generateCommentBlock } from '../rscript/format';
import { isStatement } from '../acslscript/objectmodel';
import PulseExpression from '../acslscript/pulseexpression';
import StepExpression from '../acslscript/stepexpression';
import { version } from '../../version';

let rScriptSrc = require<string>("../../template/rscript.tmpl");
let tmplRScript = loTemplate(rScriptSrc);

function generateHeader(comment: string, fileName: string, messages: string[], diagnostics: string[])
{
  let lines = [];

  let line = comment + " Generated from " + fileName + " by acsl2r v" + version + " on " + new Date().toISOString();
  lines.push(line);

  if (0 < messages.length)
  {
    lines.push("");
    line = comment + " Review the following before use!";
    lines.push(line);

    let unique = new Set(messages);
    unique.forEach(m =>
    {
      lines.push("");
      let parts = m.split("\n");
      parts.forEach(p => lines.push(comment + " " + p));
    });
  }

  if (0 < diagnostics.length)
  {
    lines.push("");
    line = comment + " The lexer/parser issued the following diagnostics:";
    lines.push(line);

    let unique = new Set(diagnostics);
    unique.forEach(d =>
    {
      lines.push("");
      let wrapped = wordWrap(d, { indent: '', width: 78 });
      let parts = wrapped.split("\n");
      parts.forEach(p => lines.push(comment + " " + p));
    });
  }

  lines.push("");
  line = comment + " Help improve this tool: please submit faults you find to";
  lines.push(line);
  line = comment + " https://github.com/acsl2r/acsl2r/issues";
  lines.push(line);

  let header = lines.join("\n");
  return header;
}

export function generateRScript(
  acslProgram: AcslProgram,
  fileName: string,
  messages: string[],
  diagnostics: string[],
  assignParameters: string,
  calculateVariables: string,
  derivative: string,
  eventHandler: string,
  runModel: string,
  terminal: string
)
{
  let header = generateHeader("#", fileName, messages, diagnostics);
  let headerComments = generateCommentBlock(acslProgram.comments, CommentPlacement.PreSection, "#", "");
  let initialComments = generateCommentBlock(acslProgram.initialSection.comments, CommentPlacement.PreSection, "#", "");
  let dynamicComments = generateCommentBlock(acslProgram.dynamicSection.comments, CommentPlacement.PreSection, "#", "");
  let derivativeComments = generateCommentBlock(acslProgram.dynamicSection.derivativeSection.comments, CommentPlacement.PreSection, "#", "");
  let dynamicEndSectionComments = generateCommentBlock(acslProgram.dynamicSection.comments, CommentPlacement.EndSection, "#", "");
  let terminalComments = generateCommentBlock(acslProgram.terminalSection.comments, CommentPlacement.PreSection, "#", "");
  let programEndSectionComments = generateCommentBlock(acslProgram.comments, CommentPlacement.EndSection, "#", "");
  let footerComments = generateCommentBlock(acslProgram.comments, CommentPlacement.PostSection, "#", "");
  let requiresPulseFunction = acslProgram.nonNativeExpressions.some(e => e instanceof (<any>PulseExpression));
  let requiresStepFunction = acslProgram.nonNativeExpressions.some(e => e instanceof (<any>StepExpression));

  let rScript = tmplRScript({
    header: header,
    headerComments: headerComments,
    initialComments: initialComments,
    assignParameters: assignParameters,
    calculateVariables: calculateVariables,
    dynamicComments: dynamicComments,
    derivativeComments: derivativeComments,
    derivative: derivative,
    eventHandler: eventHandler,
    runModel: runModel,
    dynamicEndSectionComments: dynamicEndSectionComments,
    terminalComments: terminalComments,
    terminal: terminal,
    programEndSectionComments: programEndSectionComments,
    footerComments: footerComments,
    requiresPulseFunction: requiresPulseFunction,
    requiresStepFunction: requiresStepFunction
  });

  return rScript;
}
