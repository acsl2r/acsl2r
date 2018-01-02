import { assignIn as loAssignIn, partition as loPartition } from 'lodash';
import { AcslLexer, AcslListener, AcslParser } from '../../grammar/acsl';
import * as Antlr4 from '../../typings/globals/antlr4ts';
import * as Antlr4Tree from '../../typings/globals/antlr4ts/tree';
import Statement from './acslscript/statement';
import TableStatement from './acslscript/tablestatement';
import ArrayStatement from './acslscript/arraystatement';
import ArrayExpression from './acslscript/arrayexpression';
import StringExpression from './acslscript/stringexpression';
import FloatExpression from './acslscript/floatexpression';
import IdExpression from './acslscript/idexpression';
import TExpression from './acslscript/texpression';
import ExpExpression from './acslscript/expexpression';
import UnaryPlusMinusExpression from './acslscript/unaryplusminusexpression';
import MulDivExpression from './acslscript/muldivexpression';
import AddSubExpression from './acslscript/addsubexpression';
import InfixExpression from './acslscript/infixexpression';
import SubExpression from './acslscript/subexpression';
import IntegExpression from './acslscript/integexpression';
import RswExpression from './acslscript/rswexpression';
import FnExpression from './acslscript/fnexpression';
import NotExpression from './acslscript/notexpression';
import PulseExpression from './acslscript/pulseexpression';
import StepExpression from './acslscript/stepexpression';
import BooleanExpression from './acslscript/booleanexpression';
import AcslProgram from './acslscript/acslprogram';
import DiscreteSection from './acslscript/discretesection';
import InitialSection from './acslscript/initialsection';
import TerminalSection from './acslscript/terminalsection';
import DynamicSection from './acslscript/dynamicsection';
import DerivativeSection from './acslscript/derivativesection';
import ConditionalSection from './acslscript/conditionalsection';
import ProceduralSection from './acslscript/proceduralsection';
import IfSection from './acslscript/ifsection';
import DoContinueSection from './acslscript/docontinuesection';
import Comment from './acslscript/comment';
import { CommentPlacement, AcslType } from '../enum';
import { IExpression, IComment, IStatement, ISection, ICodeBlock } from '../interface';
import { isStatement, orderComputations, findSymbolProvider, replaceSymbol } from './acslscript/objectmodel';
import { implementsProperty } from './system/js';

let tokenTypeID: number = (<any>AcslParser).ID;
let tokenTypeEQUALS: number = (<any>AcslParser).EQUALS;
let tokenTypeCOMMA: number = (<any>AcslParser).COMMA;

class Acsl2RListener
{
  constructor(acslProgram: AcslProgram, messages: string[])
  {
    this._acslProgram = acslProgram;
    this._messages = messages;
  }

  enterHeadedProgramWithComments(ctx: Antlr4.ParserRuleContext)
  {
    this._codeBlocks.push(this._acslProgram);
    this._enterHeadedProgram(ctx);
  }

  exitHeadedProgramWithComments(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProgram(ctx);
  }

  enterHeadedProgramWithoutComments(ctx: Antlr4.ParserRuleContext)
  {
    this._codeBlocks.push(this._acslProgram);
    this._enterHeadedProgram(ctx);
  }

  exitHeadedProgramWithoutComments(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProgram(ctx);
  }

  enterProgramWithComments(ctx: Antlr4.ParserRuleContext)
  {
    this._codeBlocks.push(this._acslProgram);
  }

  exitProgramWithComments(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProgram(ctx);
  }

  enterProgramWithoutComments(ctx: Antlr4.ParserRuleContext)
  {
    this._codeBlocks.push(this._acslProgram);
  }

  exitProgramWithoutComments(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProgram(ctx);
  }

  private _enterHeadedProgram(ctx: Antlr4.ParserRuleContext)
  {
    let index = 0;
    let lastHeaderComment: Antlr4.ParserRuleContext;
    while ((ctx.children[index] as Antlr4.RuleContext).ruleIndex == AcslParser["RULE_comment"])
    {
      lastHeaderComment = ctx.children[index] as Antlr4.ParserRuleContext;
      ++index;
    }
    this._lastHeaderCommentLineNo = lastHeaderComment.start.line;
  }

  private setDefaults()
  {
    if (!(this._acslProgram.dynamicSection.cinterval instanceof Statement))
    {
      let lvalue = new IdExpression("CINT");
      let computation = new FloatExpression(0.01);
      let statement = new Statement(lvalue, computation);
      statement.isConstant = true;
      this._acslProgram.dynamicSection.cinterval = statement;
      let message = "Setting default CINTERVAL.";
      this._messages.push(message);
    }

    let tStop: IStatement = null;
    if (this._acslProgram.dynamicSection.termt instanceof InfixExpression)
    {
      let tStopExpr: IExpression = null;
      let lhs = this._acslProgram.dynamicSection.termt.lhs.toCode("R", 0);
      if (this._acslProgram.dynamicSection.termt.lhs instanceof TExpression)
      {
        tStopExpr = this._acslProgram.dynamicSection.termt.rhs;
      }
      else if (this._acslProgram.dynamicSection.termt.rhs instanceof TExpression)
      {
        tStopExpr = this._acslProgram.dynamicSection.termt.lhs;
      }
      if (!!tStopExpr)
      {
        if (tStopExpr instanceof FloatExpression)
        {
          tStop = new Statement(new IdExpression("TSTOP"), tStopExpr);
          tStop.isConstant = true;
          this._acslProgram.initialSection.codeBlocks.push(tStop);
        }
        else if (tStopExpr instanceof IdExpression)
        {
          let provider = findSymbolProvider(this._acslProgram.initialSection, tStopExpr);
          if (null == provider)
          {
            provider = findSymbolProvider(this._acslProgram.dynamicSection.derivativeSection, tStopExpr);
            if (!!provider && provider.computation instanceof FloatExpression)
            {
              let index = this._acslProgram.dynamicSection.derivativeSection.codeBlocks.indexOf(provider);
              if (!!~index)
              {
                this._acslProgram.dynamicSection.derivativeSection.codeBlocks.splice(index, 1);
                this._acslProgram.initialSection.codeBlocks.push(provider);
              }
              else
              {
                provider = null; // can't use
              }
            }
          }
          if (!!provider && provider instanceof Statement && provider.computation instanceof FloatExpression)
          {
            tStop = provider;
          }
        }
      }
    }
    if (null == tStop)
    {
      tStop = new Statement(new IdExpression("TSTOP"), new FloatExpression(1.0));
      tStop.isConstant = true;
      this._acslProgram.initialSection.codeBlocks.push(tStop);
      let message = "Could not determine stop time from TERMT. Setting default.";
      this._messages.push(message);
    }
    this._acslProgram.dynamicSection.tStop = tStop;
  }

  private findFloatValue(expression: IExpression)
  {
    let value: number = null;
    if (expression instanceof FloatExpression)
    {
      value = expression.float;
    }
    else if (expression instanceof IdExpression)
    {
      let provider = findSymbolProvider(this._acslProgram.initialSection, expression);
      if (null != provider && provider.computation instanceof FloatExpression)
      {
        value = provider.computation.float;
      }
    }
    return value;
  }

  private unrollSchedulingLoops()
  {
    this._doContinueSections.forEach(cs =>
    {
      if (0 == cs.schedules.length) return;

      let initial = this.findFloatValue(cs.initial);
      if (null == initial)
      {
        let message = "Failed to evaluate loop initial: " + cs.initial.toCode("R", 0);
        this._messages.push(message);
        return;
      }
      let terminal = this.findFloatValue(cs.terminal);
      if (null == terminal)
      {
        let message = "Failed to evaluate loop terminal: " + cs.terminal.toCode("R", 0);
        this._messages.push(message);
        return;
      }
      let increment = this.findFloatValue(cs.increment);
      if (null == increment)
      {
        let message = "Failed to evaluate loop increment: " + cs.increment.toCode("R", 0);
        this._messages.push(message);
        return;
      }

      let index = cs.index.toCode("R", 0);

      for (let i = initial; i <= terminal; i += increment)
      {
        let indexValue = new FloatExpression(i);
        cs.schedules.forEach(s =>
        {
          let schedule = s.clone();
          replaceSymbol(schedule, index, indexValue);
          this._acslProgram.initialSection.schedules.push(schedule);
        });
      }

      cs.schedules.length = 0;
    });
  }

  private _exitProgram(ctx: Antlr4.ParserRuleContext)
  {
    this.gatherEndProgramComments(ctx);
    this._acslProgram.applyAcslTypes(this._acslProgram.typeDictionary);
    this._doContinueSections.forEach(dcs => dcs.applyAcslTypes(this._acslProgram.typeDictionary));
    this.checkLvalueConsistency();
    this.reviseSymbolUsage();

    Acsl2RListener.distributeMiscellaneousCodeBlocks(this._acslProgram, this._acslProgram.codeBlocks);
    this._acslProgram.codeBlocks.length = 0;
    Acsl2RListener.distributeMiscellaneousCodeBlocks(this._acslProgram, this._acslProgram.dynamicSection.codeBlocks);
    this._acslProgram.dynamicSection.codeBlocks.length = 0;

    this.setDefaults();

    this.unrollSchedulingLoops();

    this._expressions.forEach(e => this._messages.push("Listener failure -- unhandled: " + e.toCode("R", 0)));

    let messages = orderComputations(this._acslProgram);
    if (!!messages) this._messages.push(...messages);

    this._codeBlocks.pop(); // acslProgram out
  }

  enterDiscreteWithComment(ctx: Antlr4.ParserRuleContext)
  {
    let discreteSection = new DiscreteSection();
    this.processPreSectionComments(discreteSection.comments);
    this._codeBlocks.push(discreteSection);
  }

  exitDiscreteWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDiscrete(ctx);
  }

  enterDiscreteWithoutCommment(ctx: Antlr4.ParserRuleContext)
  {
    let discreteSection = new DiscreteSection();
    this.processPreSectionComments(discreteSection.comments);
    this._codeBlocks.push(discreteSection);
  }

  exitDiscreteWithoutCommment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDiscrete(ctx);
  }

  private _exitDiscrete(ctx: Antlr4.ParserRuleContext)
  {
    let discreteSection = this.popCodeBlock(DiscreteSection) as DiscreteSection;
    let node = ctx.children[1] as Antlr4Tree.TerminalNode;
    discreteSection.name = node.symbol.text;
    this.processEndSectionComments(discreteSection.comments, ctx.stop.line);
    let dynamicSection = this.getCurrentSection(DynamicSection) as DynamicSection;
    dynamicSection.discreteSections.push(discreteSection);
  }

  exitInterval(ctx: Antlr4.ParserRuleContext)
  {
    let discreteSection = this.getCurrentSection(DiscreteSection) as DiscreteSection;
    if (null == discreteSection)
    {
      this._messages.push("INTERVAL statements supported only in DISCRETE sections");
    }
    else if (null != discreteSection.intervalAssignment)
    {
      this._messages.push("Found more than one interval assignment");
    }
    else
    {
      let intervalAssignment = this.getCurrentStatement(discreteSection);
      if (null == intervalAssignment)
      {
        this._messages.push("Expecting statement after INTERVAL");
      }
      else if (!(intervalAssignment instanceof Statement) || null == intervalAssignment.lvalue)
      {
        this._messages.push("Expecting assignment after INTERVAL. Found: " + Acsl2RListener.toText(ctx, intervalAssignment));
      }
      else
      {
        discreteSection.intervalAssignment = intervalAssignment;
      }
    }
  }

  enterInitialWithComment(ctx: Antlr4.ParserRuleContext)
  {
    let initialSection = this._acslProgram.initialSection;
    this.processPreSectionComments(initialSection.comments);
    this._codeBlocks.push(initialSection);
  }

  exitInitialWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitInitial(ctx);
  }

  enterInitialWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    let initialSection = this._acslProgram.initialSection;
    this.processPreSectionComments(initialSection.comments);
    this._codeBlocks.push(initialSection);
  }

  exitInitialWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitInitial(ctx);
  }

  private _exitInitial(ctx: Antlr4.ParserRuleContext)
  {
    let initialSection = this.popCodeBlock(InitialSection) as InitialSection;
    this.processEndSectionComments(initialSection.comments, ctx.stop.line);
  }

  enterTerminalWithComment(ctx: Antlr4.ParserRuleContext)
  {
    let terminalSection = this._acslProgram.terminalSection;
    this.processPreSectionComments(terminalSection.comments);
    this._codeBlocks.push(terminalSection);
  }

  exitTerminalWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitTerminal(ctx);
  }

  enterTerminalWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    let terminalSection = this._acslProgram.terminalSection;
    this.processPreSectionComments(terminalSection.comments);
    this._codeBlocks.push(terminalSection);
  }

  exitTerminalWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitTerminal(ctx);
  }

  private _exitTerminal(ctx: Antlr4.ParserRuleContext)
  {
    let terminalSection = this.popCodeBlock(TerminalSection) as TerminalSection;
    this.processEndSectionComments(terminalSection.comments, ctx.stop.line);
  }

  exitConstant(ctx: Antlr4.ParserRuleContext)
  {
    let exprOrAssignContext = ctx.children[1] as Antlr4.ParserRuleContext;
    let nDeclarations = Acsl2RListener.getCommaCount(exprOrAssignContext.children) + 1;
    let statements: Statement[] = [];
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];

    for (let i = 0; i < nDeclarations; ++i)
    {
      let statement = codeBlock.codeBlocks[codeBlock.codeBlocks.length - 1 - i];
      if (!(statement instanceof Statement) || !(statement.lvalue instanceof IdExpression))
      {
        return;
      }
      statements.push(statement);
    }

    statements.forEach(s => s.isConstant = true);
  }

  exitSchedule(ctx: Antlr4.ParserRuleContext)
  {
    let section = this._codeBlocks[this._codeBlocks.length - 1];
    let schedule = this._expressions.pop();

    if (!(schedule instanceof InfixExpression))
    {
      this._messages.push("Ignoring non-infix SCHEDULE: " + Acsl2RListener.toText(ctx, schedule));
    }
    else if (schedule.infix != "__at")
    {
      this._messages.push("Ignoring SCHEDULE missing .AT.: " + Acsl2RListener.toText(ctx, schedule));
    }
    else if (section instanceof ConditionalSection)
    {
      this._messages.push("Ignoring conditional SCHEDULE: " + Acsl2RListener.toText(ctx, schedule));
    }
    else if (implementsProperty(section, "schedules"))
    {
      (<any>section).schedules.push(schedule);
    }
    else
    {
      this._acslProgram.initialSection.schedules.push(schedule);
    }
  }

  enterDynamicWithComment(ctx: Antlr4.ParserRuleContext)
  {
    let dynamicSection = this._acslProgram.dynamicSection;
    this.processPreSectionComments(dynamicSection.comments);
    this._codeBlocks.push(dynamicSection);
  }

  exitDynamicWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDynamic(ctx);
  }

  enterDynamicWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    let dynamicSection = this._acslProgram.dynamicSection;
    this.processPreSectionComments(dynamicSection.comments);
    this._codeBlocks.push(dynamicSection);
  }

  exitDynamicWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDynamic(ctx);
  }

  private _exitDynamic(ctx: Antlr4.ParserRuleContext)
  {
    let dynamicSection = this.popCodeBlock(DynamicSection) as DynamicSection;
    this.processEndSectionComments(dynamicSection.comments, ctx.stop.line);
  }

  exitAlgorithm(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    this._acslProgram.dynamicSection.algorithm = statement;
  }

  exitMaxterval(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    this._acslProgram.dynamicSection.maxterval = statement;
  }

  exitMinterval(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    this._acslProgram.dynamicSection.minterval = statement;
  }

  exitCinterval(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    if (!(statement instanceof Statement) || null == statement.lvalue)
    {
      this._messages.push("Expecting CINTERVAL assignment. Found: " + Acsl2RListener.toText(ctx, statement));
    }
    else
    {
      this._acslProgram.dynamicSection.cinterval = statement;
    }
  }

  exitNsteps(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    this._acslProgram.dynamicSection.nsteps = statement;
  }

  enterDerivativeWithComment(ctx: Antlr4.ParserRuleContext)
  {
    let derivativeSection = this._acslProgram.dynamicSection.derivativeSection;
    this.processPreSectionComments(derivativeSection.comments);
    this._codeBlocks.push(derivativeSection);
  }

  exitDerivativeWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDerivative(ctx);
  }

  enterDerivativeWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    let derivativeSection = this._acslProgram.dynamicSection.derivativeSection;
    this.processPreSectionComments(derivativeSection.comments);
    this._codeBlocks.push(derivativeSection);
  }

  exitDerivativeWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDerivative(ctx);
  }

  private _exitDerivative(ctx: Antlr4.ParserRuleContext)
  {
    let derivativeSection = this.popCodeBlock(DerivativeSection) as DerivativeSection;
    this.processEndSectionComments(derivativeSection.comments, ctx.stop.line);
  }

  enterIfBlock(ctx: Antlr4.ParserRuleContext)
  {
    if (!this._transitioningtoElseIf)
    {
      let ifSection = new IfSection();
      this.processPreSectionComments(ifSection.comments);
      let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
      codeBlock.codeBlocks.push(ifSection);
    }
    this._transitioningtoElseIf = false;

    let conditionalSection = new ConditionalSection();
    this._codeBlocks.push(conditionalSection);
  }

  exitIfBlock(ctx: Antlr4.ParserRuleContext)
  {
  }

  enterElseIfEndBlockEnd(ctx: Antlr4.ParserRuleContext)
  {
  }

  exitElseIfEndBlockEnd(ctx: Antlr4.ParserRuleContext)
  {
  }

  enterElseIfEndBlockElseIf(ctx: Antlr4.ParserRuleContext)
  {
    this._transitioningtoElseIf = true;
  }

  exitElseIfEndBlockElseIf(ctx: Antlr4.ParserRuleContext)
  {
  }

  enterElseIfEndBlockElse(ctx: Antlr4.ParserRuleContext)
  {
    let conditionalSection = new ConditionalSection();
    this._codeBlocks.push(conditionalSection);
  }

  exitElseIfEndBlockElse(ctx: Antlr4.ParserRuleContext)
  {
    let conditionalSection = this._codeBlocks.pop() as ConditionalSection;
    let section = this._codeBlocks[this._codeBlocks.length - 1];
    let ifSection = section.codeBlocks[section.codeBlocks.length - 1] as IfSection;
    ifSection.conditionalSections.push(conditionalSection);
  }

  enterThenBlock(ctx: Antlr4.ParserRuleContext)
  {
    let conditionalSection = this._codeBlocks[this._codeBlocks.length - 1] as ConditionalSection;
    conditionalSection.condition = this._expressions.pop();
  }

  exitThenBlock(ctx: Antlr4.ParserRuleContext)
  {
    let conditionalSection = this._codeBlocks.pop() as ConditionalSection;
    let section = this._codeBlocks[this._codeBlocks.length - 1];
    let ifSection = section.codeBlocks[section.codeBlocks.length - 1] as IfSection;
    ifSection.conditionalSections.push(conditionalSection);
  }

  enterIfLogical(ctx: Antlr4.ParserRuleContext)
  {
    let ifSection = new IfSection();
    this.processPreSectionComments(ifSection.comments);
    this._codeBlocks.push(ifSection);

    let conditionalSection = new ConditionalSection();
    this._codeBlocks.push(conditionalSection);
  }

  exitIfLogical(ctx: Antlr4.ParserRuleContext)
  {
    let conditionalSection = this._codeBlocks.pop() as ConditionalSection;
    conditionalSection.condition = this._expressions.pop();

    let ifSection = this._codeBlocks.pop() as IfSection;
    ifSection.conditionalSections.push(conditionalSection);

    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(ifSection);
  }

  exitTable(ctx: Antlr4.ParserRuleContext)
  {
    let args: IExpression[] = [];
    let nArgs = Acsl2RListener.getCommaCount(ctx.children) + 1;
    for (let i = 0; i < nArgs; ++i)
    {
      let arg = this._expressions.pop();
      if (arg instanceof FloatExpression)
      {
        args.push(arg);
      }
      else if (arg instanceof MulDivExpression && arg.lhs instanceof FloatExpression)
      {
        let repeat = arg.lhs.float;
        while (repeat--)
        {
          args.push(arg.rhs.clone());
        }
      }
      else
      {
        let message = "Unexpected expression in TABLE: " + arg.toCode("R", 0);
        this._messages.push(message);
        return;
      }
    }

    let name = this._expressions.pop();
    if (!(name instanceof IdExpression))
    {
      let message = "Expected TABLE name: " + name.toCode("R", 0);
      this._messages.push(message);
      return;
    }

    this._symbols.delete(name);
    this._lvalues.add(name);

    let expr = args.pop();
    let n = +expr.toCode("R", 0);

    if (n > 1)
    {
      let message = "TABLEs of more than one independent variable not supported: " + name.toCode("R", 0);
      this._messages.push(message);
      return;
    }

    expr = args.pop();
    let d = +expr.toCode("R", 0);

    if ((2 * d) != args.length)
    {
      let message = "Misspecified TABLE: " + name.toCode("R", 0);
      this._messages.push(message);
      return;
    }

    args.reverse();

    let independent = [];
    let dependent = []

    for (let i = 0; i < d; ++i)
    {
      independent.push(args[i]);
    }
    for (let i = 0; i < d; ++i)
    {
      dependent.push(args[d + i]);
    }

    let tableStatement = new TableStatement(name, independent, dependent);

    let comments = this.collectComments(ctx.start.line);
    tableStatement.comments.push(...comments);

    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(tableStatement);
  }

  exitParameter(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.getCurrentStatement() as Statement;
    statement.isConstant = true;
    let comments = this.collectComments(ctx.start.line);
    statement.comments.push(...comments);
    this._messages.push("Converted PARAMETER: " + Acsl2RListener.toText(ctx, statement));
  }

  enterDoContinueIncr(ctx: Antlr4.ParserRuleContext)
  {
    let doContinueSection = new DoContinueSection();
    this.processPreSectionComments(doContinueSection.comments);
    this._codeBlocks.push(doContinueSection);
  }

  exitDoContinueIncr(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDoContinueIncr(ctx);
  }

  _exitDoContinueIncr(ctx: Antlr4.ParserRuleContext)
  {
    let doContinueSection = this.popCodeBlock(DoContinueSection) as DoContinueSection;
    let terminalLabel = this._expressions.pop();
    doContinueSection.increment = doContinueSection.increment || this._expressions.pop();
    doContinueSection.terminal = this._expressions.pop();
    doContinueSection.label = this._expressions.pop();
    let initialIndex = doContinueSection.codeBlocks.shift();

    if (terminalLabel.toCode("R", 0) != doContinueSection.label.toCode("R", 0))
    {
      this._messages.push("Label mismatch in DO..CONTINUE: " + terminalLabel.toCode("R", 0) + " != " + doContinueSection.label.toCode("R", 0));
      return;
    }

    if (!(initialIndex instanceof Statement) || null == initialIndex.lvalue)
    {
      this._messages.push("Expecting assignment in DO..CONTINUE index initializer: " + Acsl2RListener.toText(ctx, initialIndex));
      return;
    }

    doContinueSection.index = initialIndex.lvalue;
    doContinueSection.initial = initialIndex.computation;

    this._doContinueSections.push(doContinueSection);

    if (0 < doContinueSection.codeBlocks.length)
    {
      let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
      codeBlock.codeBlocks.push(doContinueSection);
    }
  }

  enterDoContinue(ctx: Antlr4.ParserRuleContext)
  {
    let doContinueSection = new DoContinueSection();
    doContinueSection.increment = new FloatExpression(1.0);
    this.processPreSectionComments(doContinueSection.comments);
    this._codeBlocks.push(doContinueSection);
  }

  exitDoContinue(ctx: Antlr4.ParserRuleContext)
  {
    this._exitDoContinueIncr(ctx);
  }

  exitGoTo(ctx: Antlr4.ParserRuleContext)
  {
    let label = this._expressions.pop();
    let statement = new Statement(null, label);
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(statement);
    let message = "GO TO not supported. Please remove, or refactor your code: " + Acsl2RListener.toText(ctx, statement);
    this._messages.push(message);
  }

  exitLabelStatement(ctx: Antlr4.ParserRuleContext)
  {
    let label = this._expressions.pop();
    let statement = this.popStatement();
    let asText = statement.toCode("R");
    statement = new Statement(null, new StringExpression(label.toCode("R", 0) + " #" + asText));
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(statement);
    let message = "Label:Statement not supported. Please remove, or refactor your code: " + Acsl2RListener.toText(ctx, statement);
    this._messages.push(message);
  }

  exitLabelContinue(ctx: Antlr4.ParserRuleContext)
  {
    let label = this._expressions.pop();
    let statement = new Statement(null, label);
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(statement);
    let message = "Label:CONTINUE not supported. Please remove, or refactor your code: " + Acsl2RListener.toText(ctx, statement);
    this._messages.push(message);
  }

  exitCall(ctx: Antlr4.ParserRuleContext)
  {
    let statement = this.popStatement();
    this._comments.length = 0;
    this._messages.push("Discarded CALL: " + Acsl2RListener.toText(ctx, statement));
  }

  exitVariable(ctx: Antlr4.ParserRuleContext)
  {
    this.popStatement();
    this.collectComments(ctx.start.line);
    this._messages.push("Discarded VARIABLE statement");
  }

  exitType(acslType: AcslType, ctx: Antlr4.ParserRuleContext)
  {
    let nDeclarations = Acsl2RListener.getCommaCount(ctx.children) + 1;
    let declarations = [];
    for (let i = 0; i < nDeclarations; ++i)
    {
      declarations.push(this._expressions.pop());
    }
    declarations.reverse();
    let comments = this.collectComments(ctx.start.line);
    declarations.forEach((d, i) =>
    {
      let name: IdExpression;
      if (d instanceof FnExpression)
      {
        name = d.name;
        let dimensions = d.args;
        let arrayStatement = new ArrayStatement(name, acslType, dimensions);
        if (!!comments)
        {
          arrayStatement.comments.push(...comments);
          comments = null;
        }
        let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
        codeBlock.codeBlocks.push(arrayStatement);
      }
      else if (d instanceof IdExpression)
      {
        name = d;
      }
      else
      {
        throw new Error("Exiting type declaration with unexpected expression type: " + typeof d);
      }
      this._lvalues.add(name);
      this._acslProgram.typeDictionary.set(name.toCode("R", 0), acslType);
    });
  }

  exitDimensionType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.Dimension, ctx);
  }

  exitRealType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.Real, ctx);
  }

  exitDoublePrecisionType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.DoublePrecision, ctx);
  }

  exitIntegerType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.Integer, ctx);
  }

  exitLogicalType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.Logical, ctx);
  }

  exitCharacterType(ctx: Antlr4.ParserRuleContext)
  {
    this.exitType(AcslType.Character, ctx);
  }

  private _enterProcedural(ctx: Antlr4.ParserRuleContext)
  {
    let outputs: string[] = [];
    let inputs: string[] = [];

    let ids = outputs;
    for (let i = 0; i < ctx.children.length; ++i)
    {
      let child = ctx.children[i] as Antlr4Tree.TerminalNode;
      if (!!child.symbol)
      {
        if (child.symbol.type == tokenTypeEQUALS)
        {
          ids = inputs;
        }
        else if (child.symbol.type == tokenTypeID)
        {
          ids.push(child.symbol.text);
        }
      }
    }

    let outputExpressions = outputs.map(o => new IdExpression(o));
    let inputExpressions = inputs.map(i => new IdExpression(i));

    let proceduralSection = new ProceduralSection();
    proceduralSection.outputs.push(...outputExpressions);
    proceduralSection.inputs.push(...inputExpressions);

    this._codeBlocks.push(proceduralSection);
  }

  private _exitProcedural(ctx: Antlr4.ParserRuleContext)
  {
    let procedural = this._codeBlocks.pop();
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(procedural);
  }

  enterProceduralWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._enterProcedural(ctx);
  }

  exitProceduralWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProcedural(ctx);
  }

  enterProceduralWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._enterProcedural(ctx);
  }

  exitProceduralWithoutComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitProcedural(ctx);
  }

  exitAssignExprOrAssignWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitAssignExprOrAssign(ctx);
  }

  exitAssignExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    this._exitAssignExprOrAssign(ctx);
  }

  private _exitAssignExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    let statement = codeBlock.codeBlocks.pop();

    if (!(statement instanceof Statement)) throw new Error("Expecting Statement on exiting ExprOrAssign");

    let computation = statement.computation;
    let lvalue = this._expressions.pop();

    if (lvalue instanceof FnExpression)
    {
      this._symbols.delete(lvalue.name as IdExpression);
      let arrayExpression = new ArrayExpression(lvalue.name, lvalue.args);
      lvalue = arrayExpression;
    }
    else if (lvalue instanceof IdExpression)
    {
      this._symbols.delete(lvalue);
      this._lvalues.add(lvalue);
    }
    else if (lvalue instanceof TExpression)
    {
      // VARIABLE statement
    }
    else
    {
      this._messages.push("Unexpected lvalue type: " + lvalue.toCode("R", 0));
      return;
    }

    statement.lvalue = lvalue;

    let comments = this.collectComments(ctx.start.line);
    statement.comments.push(...comments);

    if (computation instanceof IntegExpression)
    {
      this._acslProgram.dynamicSection.derivativeSection.integs.push(statement);
    }
    else
    {
      codeBlock.codeBlocks.push(statement);
    }
  }

  exitListExprOrAssignWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitListExprOrAssign(ctx);
  }

  exitListExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    this._exitListExprOrAssign(ctx);
  }

  _exitListExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    let lvalue = this._expressions.shift();
    if (!(lvalue instanceof IdExpression))
    {
      this._messages.push("Expecting identifier in list assignment: " + lvalue.toCode("R", 0));
    }
    let name = new IdExpression(lvalue.toCode("R", 0));
    this._symbols.add(name);

    let items: IExpression[] = [];

    while (0 < this._expressions.length)
    {
      let item = this._expressions.shift();
      if (item instanceof FloatExpression)
      {
        items.push(item)
      }
      else if (item instanceof MulDivExpression && item.lhs instanceof FloatExpression)
      {
        let repeat = item.lhs.float;
        while (repeat--)
        {
          items.push(item.rhs.clone());
        }
      }
      else
      {
        this._messages.push("Unexpected list item: " + item.toCode("R", 0));
      }
    }

    let index = 1;
    let arrayExpression = new ArrayExpression(name, [new FloatExpression(index)]);
    let statement = new Statement(arrayExpression, items.shift());
    let comments = this.collectComments(ctx.start.line);
    statement.comments.push(...comments);

    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(statement);

    while (0 < items.length)
    {
      arrayExpression = new ArrayExpression(name, [new FloatExpression(++index)]);
      statement = new Statement(arrayExpression, items.shift());
      codeBlock.codeBlocks.push(statement);
    }
  }

  exitMultipleExprOrAssignWithComment(ctx: Antlr4.ParserRuleContext)
  {
    this._exitMultipleExprOrAssign(ctx);
  }

  exitMultipleExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    this._exitMultipleExprOrAssign(ctx);
  }

  _exitMultipleExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    let nDeclarations = Acsl2RListener.getCommaCount(ctx.children) + 1;
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    let comments = this.collectComments(ctx.start.line);

    while (0 < nDeclarations--)
    {
      let lvalue = this._expressions.shift();
      let computation = this._expressions.shift();

      if (lvalue instanceof FnExpression)
      {
        this._symbols.delete(lvalue.name as IdExpression);
        let arrayExpression = new ArrayExpression(lvalue.name, lvalue.args);
        lvalue = arrayExpression;
      }
      else if (lvalue instanceof IdExpression)
      {
        this._symbols.delete(lvalue);
        this._lvalues.add(lvalue);
      }
      else
      {
        this._messages.push("Unexpected lvalue type: " + lvalue.toCode("R", 0));
        return;
      }

      let statement = new Statement(lvalue, computation);
      statement.comments.push(...comments);

      if (computation instanceof IntegExpression)
      {
        this._acslProgram.dynamicSection.derivativeSection.integs.push(statement);
      }
      else
      {
        codeBlock.codeBlocks.push(statement);
      }
    }
  }

  exitExprExprOrAssign(ctx: Antlr4.ParserRuleContext)
  {
    if (0 == this._expressions.length) return; // termt etc.

    let computation = this._expressions.pop();
    let statement = new Statement(null, computation);
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    codeBlock.codeBlocks.push(statement);
  }

  exitBoolExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[0] as Antlr4Tree.TerminalNode;
    let value = node.symbol.text;
    let expression = new BooleanExpression(value);
    this._expressions.push(expression);
  }

  exitFloatExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = (ctx as any).FLOAT() as Antlr4Tree.TerminalNode;
    let expression = new FloatExpression(+node.symbol.text);
    this._expressions.push(expression);
  }

  exitIdExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = (ctx as any).ID() as Antlr4Tree.TerminalNode;
    let text = node.symbol.text;
    if (text.toLowerCase() == "t")
    {
      let expression = new TExpression();
      this._expressions.push(expression);
    }
    else
    {
      let expression = new IdExpression(text);
      this._symbols.add(expression);
      this._expressions.push(expression);
    }
  }

  exitSubExpr(ctx: Antlr4.ParserRuleContext)
  {
    let expression = new SubExpression(this.refactor(this._expressions.pop()));
    this._expressions.push(expression);
  }

  exitExpExpr(ctx: Antlr4.ParserRuleContext)
  {
    let rhs = this.refactor(this._expressions.pop());
    let lhs = this.refactor(this._expressions.pop());
    let expression = new ExpExpression(lhs, rhs);
    this._expressions.push(expression);
  }

  exitInfixExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[1] as Antlr4Tree.TerminalNode;
    let infix = node.symbol.text;
    let rhs = this._expressions.pop();
    let lhs = this._expressions.pop();
    let expression = new InfixExpression(lhs, infix, rhs);
    this._expressions.push(expression);
  }

  exitUnaryExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[0] as Antlr4Tree.TerminalNode;
    let op = node.symbol.text;
    let operand = this._expressions.pop();
    let expression = new UnaryPlusMinusExpression(op, operand);
    this._expressions.push(expression);
  }

  exitMulDivExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[1] as Antlr4Tree.TerminalNode;
    let op = node.symbol.text;
    let rhs = this.refactor(this._expressions.pop());
    let lhs = this.refactor(this._expressions.pop());
    let expression = new MulDivExpression(lhs, op, rhs);
    this._expressions.push(expression);
  }

  exitStrExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = (ctx as any).STRING() as Antlr4Tree.TerminalNode;
    let expression = new StringExpression(node.symbol.text);
    this._expressions.push(expression);
  }

  exitNotExpr(ctx: Antlr4.ParserRuleContext)
  {
    let operand = this._expressions.pop();
    let expression = new NotExpression(operand);
    this._expressions.push(expression);
  }

  exitIntExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = (ctx as any).INT() as Antlr4Tree.TerminalNode;
    let expression = new FloatExpression(+node.symbol.text);
    this._expressions.push(expression);
  }

  exitAddSubExpr(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[1] as Antlr4Tree.TerminalNode;
    let op = node.symbol.text;
    let rhs = this.refactor(this._expressions.pop());
    let lhs = this.refactor(this._expressions.pop());
    let expression = new AddSubExpression(lhs, op, rhs);
    this._expressions.push(expression);
  }

  exitFnExpr(ctx: Antlr4.ParserRuleContext)
  {
    let child = ctx.children[0] as Antlr4Tree.TerminalNode;
    let fn = child.symbol.text.toLowerCase();

    let args: IExpression[] = [];
    if (ctx.children.length > 3)
    {
      let nArgs = Acsl2RListener.getCommaCount(ctx.children) + 1;
      for (let i = 0; i < nArgs; ++i)
      {
        args.push(this._expressions.pop());
      }
      if (nArgs > 1) args.reverse();
    }

    let expression: IExpression = null;

    if (fn == "integ")
    {
      expression = new IntegExpression(args[0], args[1]);
    }
    else if (fn == "rsw")
    {
      expression = new RswExpression(args[0], args[1], args[2]);
    }
    else if (fn == "termt")
    {
      let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
      if (codeBlock instanceof ConditionalSection)
      {
        let message = "Ignoring conditional TERMT: " + args[0].toCode("R", 0);
        this._messages.push(message);
      }
      else if (!!this._acslProgram.dynamicSection.termt)
      {
        let message = "Found extra TERMT: " + args[0].toCode("R", 0);
        this._messages.push(message);
      }
      else
      {
        this._acslProgram.dynamicSection.termt = args[0];
      }
      this._comments.length = 0; // discard
    }
    else if (fn == "pulse")
    {
      expression = new PulseExpression(args[0], args[1], args[2]);
      this._acslProgram.nonNativeExpressions.push(expression);
    }
    else if (fn == "step")
    {
      expression = new StepExpression(args[0]);
      this._acslProgram.nonNativeExpressions.push(expression);
    }
    else
    {
      let name = new IdExpression(child.symbol.text);
      this._symbols.add(name);
      expression = new FnExpression(name, args);
    }

    !!expression && this._expressions.push(expression);
  }

  exitComment(ctx: Antlr4.ParserRuleContext)
  {
    let node = ctx.children[0] as Antlr4Tree.TerminalNode;
    let text = node.symbol.text.substring(1).trim();
    let placement = CommentPlacement.None;
    let lineNo = ctx.start.line;
    let comment = new Comment(text, placement, lineNo);
    if (lineNo <= this._lastHeaderCommentLineNo)
    {
      comment.placement = CommentPlacement.PreSection;
      this._acslProgram.comments.push(comment);
    }
    else
    {
      this._comments.push(comment);
    }
  }

  private refactor(expression: IExpression)
  {
    if (expression instanceof IntegExpression)
    {
      let stateId = "state__" + expression.id.toCode("R", 0);
      let id = new IdExpression(stateId);
      this._lvalues.add(id);
      let statement = new Statement(id, expression);
      this._acslProgram.dynamicSection.derivativeSection.integs.push(statement);
      this._messages.push("Factored out state from INTEG subexpression: " + stateId);
      expression = id;
    }

    return expression;
  }

  private processEndSectionComments(sectionEndComments: IComment[], sectionEndLineNo: number)
  {
    let comments = this._comments;
    this._comments = [];
    comments.forEach(c =>
    {
      if (sectionEndLineNo == c.lineNo)
      {
        // discard
      }
      else if (sectionEndLineNo > c.lineNo)
      {
        c.placement = CommentPlacement.EndSection;
        sectionEndComments.push(c);
      }
      else
      {
        this._comments.push(c);
      }
    });
  }

  private processPreSectionComments(sectionPreComments: IComment[])
  {
    let comments = this._comments;
    this._comments = [];
    comments.forEach(c =>
    {
      c.placement = CommentPlacement.PreSection;
      sectionPreComments.push(c);
    });
  }

  private popStatement(): Statement | TableStatement
  {
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    let statement = codeBlock.codeBlocks.pop();
    if (!(statement instanceof Statement || statement instanceof TableStatement))
      throw new Error("Listener failure -- expecting Statement or TableStatement: " + typeof (statement));
    return statement as Statement;
  }

  private getCurrentStatement(codeBlock?: ICodeBlock): Statement | TableStatement
  {
    codeBlock = codeBlock || this._codeBlocks[this._codeBlocks.length - 1];
    let statement = codeBlock.codeBlocks[codeBlock.codeBlocks.length - 1];
    return statement instanceof Statement || statement instanceof TableStatement ?
      statement as Statement : null;
  }

  private popCodeBlock(type: any): ICodeBlock
  {
    let codeBlock = this._codeBlocks.pop();
    if (!(codeBlock instanceof type)) throw new Error("Listener failure -- type mismatch: " + typeof (type) + "/" + typeof (codeBlock));
    return codeBlock;
  }

  private getCurrentSection(type: any): ICodeBlock
  {
    let codeBlock = this._codeBlocks[this._codeBlocks.length - 1];
    return codeBlock instanceof type ? codeBlock : null;
  }

  private collectComments(assignmentLineNo: number)
  {
    if (0 == this._comments.length) return [];

    let comments = this._comments;
    this._comments = [];
    let nComments = comments.length;

    for (let i = 0; i < nComments; ++i)
    {
      let comment = comments[i];
      let lineNo = comment.lineNo;
      if (lineNo < (assignmentLineNo - 1)) comment.placement = CommentPlacement.Content;
      else if (lineNo == (assignmentLineNo - 1)) comment.placement = CommentPlacement.Line;
      else if (lineNo == assignmentLineNo) comment.placement = CommentPlacement.EndLine;
      else
      {
        comments.splice(i, 1);
        this._comments.push(comment);
      }
    }
    return comments;
  }

  private gatherEndProgramComments(ctx: Antlr4.ParserRuleContext)
  {
    let stopLine: number;
    for (let i = 0; i < ctx.children.length; ++i)
    {
      let child = ctx.children[i] as Object;
      if (child.hasOwnProperty("symbol"))
      {
        let node = child as Antlr4Tree.TerminalNode;
        if (node.symbol.text.toLowerCase() == "end")
        {
          stopLine = node.symbol.line;
          break;
        }
      }
    }

    this.processEndSectionComments(this._acslProgram.comments, stopLine);
    let comments = this._comments;
    this._comments = [];
    comments.forEach(c =>
    {
      if (c.lineNo > stopLine)
      {
        c.placement = CommentPlacement.PostSection;
        this._acslProgram.comments.push(c);
      }
    });
  }

  private checkSectionLvalueConsistency(codeBlocks: ICodeBlock[], sectionName: string)
  {
    let allSymbolsProvided = [];
    codeBlocks.forEach(cb => allSymbolsProvided.push(...cb.symbolsProvided));
    let symbolsProvided = new Set(allSymbolsProvided);

    let ncLvalues = [];
    let lcLvalues = [];
    symbolsProvided.forEach(lv =>
    {
      if (!(lv instanceof IdExpression)) return;

      let lvalue = lv.toCode("R", 0);
      let lcLvalue = lvalue.toLowerCase();
      let index = lcLvalues.indexOf(lcLvalue);
      if (!!~index && lvalue == ncLvalues[index])
      {
        // exact match with existing
      }
      else if (!~index)
      {
        ncLvalues.push(lvalue);
        lcLvalues.push(lcLvalue);
      }
      else
      {
        let message = "Probable fatal error in " + sectionName + ": found assigments to BOTH " + lvalue + " and " + ncLvalues[index];
        this._messages.push(message);
      }
    });
  }

  private checkLvalueConsistency()
  {
    this.checkSectionLvalueConsistency(this._acslProgram.initialSection.codeBlocks, "INITIAL");
    this._acslProgram.dynamicSection.discreteSections.forEach(ds =>
    {
      this.checkSectionLvalueConsistency(ds.codeBlocks, "DISCRETE=" + ds.name);
    });
    this.checkSectionLvalueConsistency(this._acslProgram.dynamicSection.derivativeSection.codeBlocks, "DERIVATIVE");
    this.checkSectionLvalueConsistency(this._acslProgram.terminalSection.codeBlocks, "TERMINAL");
  }

  private reviseSymbolUsage()
  {
    let lvalues = new Set<IdExpression>();
    let lcLvalues = [];
    this._lvalues.forEach(lv =>
    {
      let lcLvalue = lv.toCode("R", 0).toLowerCase();
      if (!~lcLvalues.indexOf(lcLvalue))
      {
        lcLvalues.push(lcLvalue);
        lvalues.add(lv);
      }
    });

    lvalues.forEach(lv =>
    {
      let revised = new Set<string>();
      let definition = lv.toCode("R", 0);
      this._symbols.forEach(s =>
      {
        let revision = s.reviseId(definition);
        if (!!revision) revised.add(revision);
      });
      if (0 < revised.size)
      {
        let list = Array.from(revised).join(", ");
        let message = "Definition is " + definition + ". Found and corrected: " + list + ".";
        this._messages.push(message);
      }
    });
  }

  private static distributeMiscellaneousCodeBlocks(acslProgram: AcslProgram, codeBlocks: ICodeBlock[])
  {
    codeBlocks.forEach(cb =>
    {
      if (cb instanceof Statement)
      {
        if (cb.computation instanceof FloatExpression)
        {
          acslProgram.initialSection.codeBlocks.push(cb);
        }
        else
        {
          acslProgram.terminalSection.codeBlocks.push(cb);
        }
      }
    });
  }

  private static getCommaCount(children: Antlr4Tree.ParseTree[])
  {
    let count = 0;

    for (let i = 0; i < children.length; ++i)
    {
      let child = children[i] as Antlr4Tree.TerminalNode;
      if (!!child.symbol)
      {
        if (child.symbol.type == tokenTypeCOMMA)
        {
          ++count;
        }
      }
    }
    return count;
  }

  private static toText(antlrObj: any, acslScriptObj: any)
  {
    let text: string;

    if (!!antlrObj && !!antlrObj.getText && typeof antlrObj.getText == "function")
    {
      text = antlrObj.getText.apply(antlrObj);
    }
    else if (implementsProperty(antlrObj, "symbol"))
    {
      text = antlrObj.symbol.text;
    }
    else if (implementsProperty(antlrObj, "text"))
    {
      text = antlrObj.text;
    }
    else if (!!acslScriptObj && !!acslScriptObj.toCode && typeof acslScriptObj.toCode == "function")
    {
      text = acslScriptObj.toCode.apply(acslScriptObj, ["R", 0]);
    }

    text = text || "?";
    text = text.trim();
    return text;
  }

  private _acslProgram: AcslProgram;
  private _expressions: IExpression[] = [];
  private _comments: IComment[] = [];
  private _lastHeaderCommentLineNo: number = 0;
  private _messages: string[];
  private _codeBlocks: ICodeBlock[] = [];
  private _transitioningtoElseIf: boolean = false;
  private _lvalues: Set<IdExpression> = new Set();
  private _symbols: Set<IdExpression> = new Set();
  private _doContinueSections: DoContinueSection[] = [];
}

export function createAcsl2RListener(acslProgram: AcslProgram, messages: string[]): Acsl2RListener
{
  let l = new AcslListener();
  let m = new Acsl2RListener(acslProgram, messages);
  loAssignIn(l, m);
  return l;
}
