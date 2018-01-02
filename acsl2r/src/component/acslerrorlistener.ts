import { assignIn as loAssignIn } from 'lodash';
import { error } from 'antlr4';
import * as Antlr4 from '../../typings/globals/antlr4ts';

class AcslErrorListener implements Antlr4.ANTLRErrorListener<string>
{
  constructor(messages: string[], diagnostics: string[], source: string[])
  {
    this._messages = messages;
    this._diagnostics = diagnostics;
    this._source = source;
  }

  syntaxError(recognizer: Antlr4.Recognizer<string, any>, offendingSymbol: string | undefined, line: number, charPositionInLine: number, msg: string, e: Antlr4.RecognitionException | undefined)
  {
    let offendingSource = this._source[line - 1].trim();
    let message = "Syntax error or unsupported feature: " + offendingSource;
    let haveRecorded = 0 < this._messages.length && message == this._messages[this._messages.length - 1];
    if (!haveRecorded) this._messages.push(message);

    let issue = !!offendingSymbol ? "offending symbol \"" + offendingSymbol + "\"" : "issue";
    this._diagnostics.push(issue + " on or before line " + line + ": " + msg);
  }

  private _messages: string[];
  private _diagnostics: string[];
  private _source: string[];
}

export function createAcslErrorListener(messages: string[], diagnostics: string[], source: string[]): Antlr4.ANTLRErrorListener<string>
{
  let errorListener: Antlr4.BaseErrorListener = new error.ErrorListener();
  loAssignIn(errorListener, new AcslErrorListener(messages, diagnostics, source));
  return errorListener;
}
