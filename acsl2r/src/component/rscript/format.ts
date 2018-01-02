import { ICodeBlock, IComment, IExpression, IStatement } from '../../interface';
import { CommentPlacement } from '../../enum';
import
{
  isStatement,
  isIfSection,
  isProceduralSection,
  isTableStatement,
  isArrayStatement,
  isDoContinueSection
}
from '../acslscript/objectmodel';
import IfSection from '../acslscript/ifsection';
import ProceduralSection from '../acslscript/proceduralsection';
import DoContinueSection from '../acslscript/docontinuesection';

export let unitIndent = "  ";

export function generateCommentBlock(comments: IComment[], placement: CommentPlacement, comment: string, indent: string)
{
  if (!comments) return "";
  let placed = comments.filter(c => c.placement == placement);
  let lines = placed.map(c => indent + "# " + c.text);
  let block = lines.join("\n");
  return block;
}

export function codeBlockToCode(codeBlock: ICodeBlock, indent: string, markRVisParameters: boolean)
{
  if (isStatement(codeBlock)) return statementToCode(codeBlock, indent, markRVisParameters);
  if (isIfSection(codeBlock)) return ifSectionToCode(codeBlock, indent, markRVisParameters);
  if (isProceduralSection(codeBlock)) return proceduralSectionToCode(codeBlock, indent, markRVisParameters);
  if (isTableStatement(codeBlock)) return statementToCode(codeBlock, indent, false);
  if (isArrayStatement(codeBlock)) return statementToCode(codeBlock, indent, false);
  if (isDoContinueSection(codeBlock)) return doContinueSectionToCode(codeBlock, indent, markRVisParameters);

  throw new Error("codeBlockToCode -- unsupported: " + typeof codeBlock);
}

function doContinueSectionToCode(doContinueSection: DoContinueSection, indent: string, markRVisParameters: boolean)
{
  let lines: string[] = [];
  let index = doContinueSection.index.toCode("R", 0);

  let line =
    indent +
    index + "__seq <- seq.int(" +
    doContinueSection.initial.toCode("R", 0) + ", " +
    doContinueSection.terminal.toCode("R", 0) + ", " +
    doContinueSection.increment.toCode("R", 0) + ")";
  lines.push(line);

  lines.push("");

  line = indent + "for(" + index + " in " + index + "__seq) {";
  lines.push(line);

  doContinueSection.codeBlocks.forEach(cb => lines.push(...codeBlockToCode(cb, indent + unitIndent, markRVisParameters)));

  line = indent + "}";
  lines.push(line);

  return lines;
}

function proceduralSectionToCode(proceduralSection: ProceduralSection, indent: string, markRVisParameters: boolean)
{
  let lines: string[] = [];
  let preSectionComments = proceduralSection.comments.filter(c => c.placement == CommentPlacement.PreSection);
  preSectionComments.forEach(c => lines.push(indent + "# " + c.text));
  proceduralSection.codeBlocks.forEach(cb => lines.push(...codeBlockToCode(cb, indent, markRVisParameters)));
  return lines;
}

function ifSectionToCode(ifSection: IfSection, indent: string, markRVisParameters: boolean)
{
  let lines: string[] = [];

  let preSectionComments = ifSection.comments.filter(c => c.placement == CommentPlacement.PreSection);
  preSectionComments.forEach(c => lines.push(indent + "# " + c.text));

  for (let i = 0; i < ifSection.conditionalSections.length; ++i)
  {
    let conditionalSection = ifSection.conditionalSections[i];
    let line = i > 0 ? lines.pop() + " else " : indent;
    if (!!conditionalSection.condition) line = line + "if (" + conditionalSection.condition.toCode("R", 0) + ") ";
    line = line + "{";
    lines.push(line);
    conditionalSection.codeBlocks.forEach(cb => lines.push(...codeBlockToCode(cb, indent + unitIndent, markRVisParameters)));
    lines.push(indent + "}");
  }

  return lines;
}

function statementToCode(statement: IStatement, indent: string, markRVisParameters: boolean)
{
  let lines: string[] = [];

  let contentComments = statement.getContentComments();
  contentComments.forEach(c => lines.push(indent + "# " + c.text));

  let lineComments = statement.getLineComments();
  let lineComment = 0 < lineComments.length ? lineComments[0].text : null;
  let endLineComments = statement.getEndLineComments();
  let endLineComment = 0 < endLineComments.length ? endLineComments[0].text : "";

  let rvisParamMarker = markRVisParameters ? "@p" : "";

  if (0 < endLineComment.length)
  {
    endLineComment = "#" + rvisParamMarker + " " + endLineComment;
    rvisParamMarker = "";
  }
  if (null != lineComment)
  {
    lineComment = indent + "#" + rvisParamMarker + " " + lineComment;
    if (0 < lines.length) lines.push("");
    lines.push(lineComment);
    rvisParamMarker = "";
  }
  if (0 < rvisParamMarker.length)
  {
    endLineComment = "#" + "@p";
    rvisParamMarker = "";
  }

  let code = indent + statement.toCode("R") + " " + endLineComment;
  lines.push(code);
  return lines;
}
