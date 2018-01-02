// Generated from Acsl.g4 by ANTLR 4.6
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by AcslParser.

function AcslVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	//return this;
}

AcslVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
AcslVisitor.prototype.constructor = AcslVisitor;

// Visit a parse tree produced by AcslParser#HeadedProgramWithComments.
AcslVisitor.prototype.visitHeadedProgramWithComments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#HeadedProgramWithoutComments.
AcslVisitor.prototype.visitHeadedProgramWithoutComments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ProgramWithComments.
AcslVisitor.prototype.visitProgramWithComments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ProgramWithoutComments.
AcslVisitor.prototype.visitProgramWithoutComments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#program.
AcslVisitor.prototype.visitProgram = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#statement.
AcslVisitor.prototype.visitStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DiscreteWithComment.
AcslVisitor.prototype.visitDiscreteWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DiscreteWithoutCommment.
AcslVisitor.prototype.visitDiscreteWithoutCommment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#interval.
AcslVisitor.prototype.visitInterval = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#InitialWithComment.
AcslVisitor.prototype.visitInitialWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#InitialWithoutComment.
AcslVisitor.prototype.visitInitialWithoutComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#TerminalWithComment.
AcslVisitor.prototype.visitTerminalWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#TerminalWithoutComment.
AcslVisitor.prototype.visitTerminalWithoutComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#constant.
AcslVisitor.prototype.visitConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#schedule.
AcslVisitor.prototype.visitSchedule = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DynamicWithComment.
AcslVisitor.prototype.visitDynamicWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DynamicWithoutComment.
AcslVisitor.prototype.visitDynamicWithoutComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#algorithm.
AcslVisitor.prototype.visitAlgorithm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#maxterval.
AcslVisitor.prototype.visitMaxterval = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#minterval.
AcslVisitor.prototype.visitMinterval = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#cinterval.
AcslVisitor.prototype.visitCinterval = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#nsteps.
AcslVisitor.prototype.visitNsteps = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DerivativeWithComment.
AcslVisitor.prototype.visitDerivativeWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DerivativeWithoutComment.
AcslVisitor.prototype.visitDerivativeWithoutComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#IfBlock.
AcslVisitor.prototype.visitIfBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ElseIfEndBlockEnd.
AcslVisitor.prototype.visitElseIfEndBlockEnd = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ElseIfEndBlockElseIf.
AcslVisitor.prototype.visitElseIfEndBlockElseIf = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ElseIfEndBlockElse.
AcslVisitor.prototype.visitElseIfEndBlockElse = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ThenBlock.
AcslVisitor.prototype.visitThenBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#IfLogical.
AcslVisitor.prototype.visitIfLogical = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#table.
AcslVisitor.prototype.visitTable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#parameter.
AcslVisitor.prototype.visitParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DoContinueIncr.
AcslVisitor.prototype.visitDoContinueIncr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DoContinue.
AcslVisitor.prototype.visitDoContinue = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#GoTo.
AcslVisitor.prototype.visitGoTo = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#LabelStatement.
AcslVisitor.prototype.visitLabelStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#LabelContinue.
AcslVisitor.prototype.visitLabelContinue = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#call.
AcslVisitor.prototype.visitCall = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#variable.
AcslVisitor.prototype.visitVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DimensionType.
AcslVisitor.prototype.visitDimensionType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#RealType.
AcslVisitor.prototype.visitRealType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#DoublePrecisionType.
AcslVisitor.prototype.visitDoublePrecisionType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#IntegerType.
AcslVisitor.prototype.visitIntegerType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#LogicalType.
AcslVisitor.prototype.visitLogicalType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#CharacterType.
AcslVisitor.prototype.visitCharacterType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ProceduralWithComment.
AcslVisitor.prototype.visitProceduralWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ProceduralWithoutComment.
AcslVisitor.prototype.visitProceduralWithoutComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#AssignExprOrAssignWithComment.
AcslVisitor.prototype.visitAssignExprOrAssignWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#AssignExprOrAssign.
AcslVisitor.prototype.visitAssignExprOrAssign = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ListExprOrAssignWithComment.
AcslVisitor.prototype.visitListExprOrAssignWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ListExprOrAssign.
AcslVisitor.prototype.visitListExprOrAssign = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#MultipleExprOrAssignWithComment.
AcslVisitor.prototype.visitMultipleExprOrAssignWithComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#MultipleExprOrAssign.
AcslVisitor.prototype.visitMultipleExprOrAssign = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ExprExprOrAssign.
AcslVisitor.prototype.visitExprExprOrAssign = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#BoolExpr.
AcslVisitor.prototype.visitBoolExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#FloatExpr.
AcslVisitor.prototype.visitFloatExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#IdExpr.
AcslVisitor.prototype.visitIdExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#SubExpr.
AcslVisitor.prototype.visitSubExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#ExpExpr.
AcslVisitor.prototype.visitExpExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#InfixExpr.
AcslVisitor.prototype.visitInfixExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#UnaryExpr.
AcslVisitor.prototype.visitUnaryExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#MulDivExpr.
AcslVisitor.prototype.visitMulDivExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#StrExpr.
AcslVisitor.prototype.visitStrExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#NotExpr.
AcslVisitor.prototype.visitNotExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#IntExpr.
AcslVisitor.prototype.visitIntExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#AddSubExpr.
AcslVisitor.prototype.visitAddSubExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#FnExpr.
AcslVisitor.prototype.visitFnExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by AcslParser#comment.
AcslVisitor.prototype.visitComment = function(ctx) {
  return this.visitChildren(ctx);
};



module.exports.AcslVisitor = AcslVisitor;