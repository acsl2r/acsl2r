import { CommonTokenStream, InputStream, tree } from 'antlr4';
import * as Antlr4 from '../../typings/globals/antlr4ts';
import * as Acsl from '../../grammar/acsl';
import { createAcslErrorListener } from './acslerrorlistener';
import AcslProgram from './acslscript/acslprogram';
import { createAcsl2RListener } from './acsl2rlistener';

function stripLineContinuations(lines: string[])
{
  let rerun: boolean;
  let i = 0;

  do
  {
    rerun = false;
    for (; i < (lines.length - 1); ++i)
    {
      let line = lines[i];
      let index = line.lastIndexOf("&");
      if (-1 != index)
      {
        let rest = line.substring(index + 1).trim();
        if (0 < rest.length) continue;
        line = line.substring(0, index);
        let removed = lines.splice(i + 1, 1);
        let next = removed[0].trim();
        if (next.startsWith("&")) next = next.substring(1);
        line = line + " " + next;
        lines[i] = line;
        rerun = true;
        break;
      }
    }
  } while (rerun);
}

let infixOperators =
  [
    "eq",
    "ne",
    "gt",
    "lt",
    "ge",
    "le",
    "eqv",
    "neqv",
    "and",
    "or",
    "at"
  ];

let reInfixOperators = infixOperators.map(io => new RegExp("\\." + io + "\\.", "gi"));
let infixOperatorReplacements = infixOperators.map(io => " __" + io + " ");

function replaceInfixOperators(lines: string[])
{
  for (let i = 0; i < reInfixOperators.length; ++i)
  {
    let re = reInfixOperators[i];
    let replacement = infixOperatorReplacements[i];

    for (let j = 0; j < lines.length; ++j)
    {
      let line = lines[j];
      line = line.replace(re, replacement);
      lines[j] = line;
    }
  }
}

let reNot = new RegExp("\\.?not\\.", "gi");
let replacementNot = " __not ";

function replaceNotOperator(lines: string[])
{
  for (let i = 0; i < lines.length; ++i)
  {
    let line = lines[i];
    line = line.replace(reNot, replacementNot);
    lines[i] = line;
  }
}

let reTrue = new RegExp("\\.true\\.", "gi");
let replacementTrue = " __true ";
let reFalse = new RegExp("\\.false\\.", "gi");
let replacementFalse = " __false ";

function replaceBooleans(lines: string[])
{
  for (let i = 0; i < lines.length; ++i)
  {
    let line = lines[i];
    line = line.replace(reTrue, replacementTrue);
    line = line.replace(reFalse, replacementFalse);
    lines[i] = line;
  }
}

function convertProgramName(lines: string[])
{
  let keyword = "program";

  for (let i = 0; i < lines.length; ++i)
  {
    let line = lines[i];
    let index = line.toLowerCase().indexOf(keyword);
    if (!~index) continue;
    index = index + keyword.length;
    let rest = line.substring(index).trim();
    if (0 != rest.length) line = line.substring(0, index) + " !" + rest;
    lines[i] = line;
    break;
  }
}

export function parse(input: string, messages: string[], diagnostics: string[])
{
  let lines = input.split(/\r?\n/);
  stripLineContinuations(lines);
  replaceInfixOperators(lines);
  replaceNotOperator(lines);
  replaceBooleans(lines);
  convertProgramName(lines);
  lines.push(""); // keep Antlr quiet
  input = lines.join("\n");

  let chars = new (<any>InputStream)(input);

  let errorListener = createAcslErrorListener(messages, diagnostics, lines);

  let lexer = new Acsl.AcslLexer(chars);
  (<any>lexer as Antlr4.Recognizer<string, any>).removeErrorListeners();
  (<any>lexer as Antlr4.Recognizer<string, any>).addErrorListener(errorListener);

  let tokens = new (<any>CommonTokenStream)(lexer);

  let parser = new Acsl.AcslParser(tokens);
  (<any>parser as Antlr4.Recognizer<string, any>).removeErrorListeners();
  (<any>parser as Antlr4.Recognizer<string, any>).addErrorListener(errorListener);
  (<any>parser).buildParseTrees = true;

  let acsl = parser.acsl();

  let acslProgram = new AcslProgram();
  let listener = createAcsl2RListener(acslProgram, messages);
  (<any>tree.ParseTreeWalker).DEFAULT.walk(listener, acsl);
  return acslProgram;
}