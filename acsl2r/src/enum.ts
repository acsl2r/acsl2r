export enum MessageType
{
  ParseACSL
}

export enum Prec
{
  Assign,
  Exp,
  Unary,
  MulDiv,
  AddSub,
  Not,
  Infix,
  Sub,
  Id,
  Int,
  Float,
  Fn,
  Integ,
  Rsw,
  Pulse,
  Step
}

export enum CommentPlacement
{
  None,
  Content,
  Line,
  EndLine,
  PreSection,
  PostSection,
  EndSection
}

export enum AcslType
{
  Dimension,
  Real,
  DoublePrecision,
  Integer,
  Logical,
  Character
}
