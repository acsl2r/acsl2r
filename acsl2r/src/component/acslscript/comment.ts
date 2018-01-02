import { CommentPlacement } from '../../enum';
import { IComment } from '../../interface';

export default class Comment implements IComment
{
  constructor(text: string, placement: CommentPlacement, lineNo: number)
  {
    this._text = text;
    this._placement = placement;
    this._lineNo = lineNo;
  }

  get text()
  {
    return this._text;
  }

  get placement()
  {
    return this._placement;
  }

  set placement(value: CommentPlacement)
  {
    this._placement = value;
  }

  get lineNo()
  {
    return this._lineNo;
  }

  private _text: string;
  private _placement: CommentPlacement;
  private _lineNo: number;
}
