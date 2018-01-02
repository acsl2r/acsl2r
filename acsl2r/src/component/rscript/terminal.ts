import AcslProgram from '../acslscript/acslprogram';
import { template as loTemplate } from 'lodash';
import { CommentPlacement } from '../../enum';
import { ICodeBlock } from '../../interface';
import { unitIndent, codeBlockToCode, generateCommentBlock } from '../rscript/format';
import { isStatement } from '../acslscript/objectmodel';

let terminalSrc = require<string>("../../template/terminal.tmpl");
let tmplTerminal = loTemplate(terminalSrc);

export function generateTerminalRScript(acslProgram: AcslProgram, outputs: string[])
{
  let codeBlocks: ICodeBlock[] = [];
  codeBlocks.push(...acslProgram.codeBlocks.filter(c => isStatement(c) && !c.isConstant));
  codeBlocks.push(...acslProgram.dynamicSection.codeBlocks.filter(c => isStatement(c) && !c.isConstant));
  codeBlocks.push(...acslProgram.terminalSection.codeBlocks);

  let computationData = codeBlocks.map(c => codeBlockToCode(c, unitIndent + unitIndent + unitIndent, false));
  let terminalEndSectionComments =
    generateCommentBlock(acslProgram.terminalSection.comments, CommentPlacement.EndSection, "#", unitIndent + unitIndent + unitIndent);
  let terminal = tmplTerminal({
    computationData: computationData,
    terminalEndSectionComments: terminalEndSectionComments,
    lastOutput: 0 == outputs.length ? "???" : outputs[outputs.length - 1]
  });
  return terminal;
}
