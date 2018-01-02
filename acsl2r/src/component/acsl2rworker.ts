import * as registerPromiseWorker from 'promise-worker/register';
import { MessageType } from '../enum';
import { IWorkerMessage, IParseACSLPayload } from '../interface';
import * as acsl2RParser from './acsl2rparser';
import * as rScriptGenerator from './rscriptgenerator';

function parseACSL(parseACSLPayload: IParseACSLPayload)
{
  let messages: string[] = [];
  let diagnostics: string[] = [];

  let acslProgram = acsl2RParser.parse(
    parseACSLPayload.code,
    messages,
    diagnostics
  );

  let rScript = rScriptGenerator.generate(
    acslProgram,
    parseACSLPayload.fileName,
    messages,
    diagnostics,
    parseACSLPayload.configureForRVis
  );

  return rScript;
}

function handleDispatch(message: IWorkerMessage) : any
{
  switch (message.type)
  {
    case MessageType.ParseACSL:
      return parseACSL(message.payload);

    default:
      throw new Error("Unhandled worker message: " + message.type);
  }
}

registerPromiseWorker(function (message: IWorkerMessage)
{
  let result = handleDispatch(message);
  return result;
});
