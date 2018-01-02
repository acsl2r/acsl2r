import { AcslType, Prec, CommentPlacement, MessageType } from './enum';

export interface IWorkerMessage
{
  type: MessageType;
  payload: any;
}

export interface IParseACSLPayload
{
  fileName: string;
  code: string;
  configureForRVis: boolean;
}

export interface IExpression
{
  toCode(lang: string, prec: Prec): string;
  symbols: IExpression[];
  applyAcslTypes(typeDictionary: Map<string, AcslType>);
  expressions: { [name: string]: IExpressionEntry };
  clone(): IExpression;
}

export interface IExpressionEntry
{
  expression: IExpression;
}

export interface IComment
{
  text: string;
  placement: CommentPlacement;
  lineNo: number;
}

export interface ICodeBlock
{
  codeBlocks: ICodeBlock[];
  toCode(lang: string): string;
  comments: IComment[];
  symbolsRequired: IExpression[];
  symbolsProvided: IExpression[];
  applyAcslTypes(typeDictionary: Map<string, AcslType>);
}

export interface IStatement extends ICodeBlock
{
  lvalue: IExpression;
  computation: IExpression;
  isConstant: boolean;
  getContentComments(): IComment[];
  getLineComments(): IComment[];
  getEndLineComments(): IComment[];
}

export interface ISection extends ICodeBlock
{
  readonly id: string;
}
