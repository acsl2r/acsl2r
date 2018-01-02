grammar Acsl;

acsl
  :  comment+ PROGRAM (program)* END comment+                                  #HeadedProgramWithComments
  |  comment+ PROGRAM (program)* END                                           #HeadedProgramWithoutComments
  |  PROGRAM (program)* END comment+                                           #ProgramWithComments
  |  PROGRAM (program)* END                                                    #ProgramWithoutComments
  ;

program
  :  initial
  |  dynamic
  |  discrete
  |  terminal
  |  statement
  |  comment
  ;

statement
  :  constant
  |  schedule
  |  interval
  |  algorithm
  |  maxterval
  |  minterval
  |  cinterval
  |  nsteps
  |  expr_or_assign
  |  if_block
  |  if_logical
  |  table
  |  type
  |  parameter
  |  do_continue
  |  go_to
  |  call
  |  variable
  ;

discrete
  :  DISCRETE ID (initial|procedural|statement|label|comment)* END comment     #DiscreteWithComment
  |  DISCRETE ID (initial|procedural|statement|label|comment)* END             #DiscreteWithoutCommment
  ;

interval
  :  INTERVAL expr_or_assign
  ;

initial
  :  INITIAL (statement|label|comment)* END comment                            #InitialWithComment
  |  INITIAL (statement|label|comment)* END                                    #InitialWithoutComment
  ;

terminal
  :  TERMINAL (statement|label|comment)* END comment                           #TerminalWithComment
  |  TERMINAL (statement|label|comment)* END                                   #TerminalWithoutComment
  ;

constant
  :  CONSTANT expr_or_assign
  ;

schedule
  :  SCHEDULE expr
  ;

dynamic
  :  DYNAMIC (initial|derivative|discrete|procedural|statement|label|comment)* END comment   #DynamicWithComment
  |  DYNAMIC (initial|derivative|discrete|procedural|statement|label|comment)* END           #DynamicWithoutComment
  ;

algorithm
  :  ALGORITHM expr_or_assign
  ;

maxterval
  :  MAXTERVAL expr_or_assign
  ;

minterval
  :  MINTERVAL expr_or_assign
  ;

cinterval
  :  CINTERVAL expr_or_assign
  ;

nsteps
  :  NSTEPS expr_or_assign
  ;

derivative
  :  DERIVATIVE (initial|procedural|statement|label|comment)* END comment      #DerivativeWithComment
  |  DERIVATIVE (initial|procedural|statement|label|comment)* END              #DerivativeWithoutComment
  ;
  
if_block
  :  IF '(' expr ')' then_block else_if_end_block                              #IfBlock
  ;

else_if_end_block
  :  (END|ENDIF|ENDSPACEIF)                                                    #ElseIfEndBlockEnd
  |  ELSE if_block                                                             #ElseIfEndBlockElseIf
  |  ELSE (statement|label|comment)* else_if_end_block                         #ElseIfEndBlockElse
  ;

then_block
  :  THEN (';')? (statement|label|comment)*                                    #ThenBlock
  ;

if_logical
  :  IF '(' expr ')' statement                                                 #IfLogical
  ;

table
  :  TABLE expr COMMA expr COMMA expr SLASH expr (COMMA expr)* SLASH
  ;

parameter
  :  PARAMETER '(' expr_or_assign (COMMA expr_or_assign)* ')' (comment)?
  ;

do_continue
  : DO expr expr_or_assign COMMA expr COMMA expr (statement|comment)* expr ':' CONTINUE      #DoContinueIncr
  | DO expr expr_or_assign COMMA expr (statement|comment)* expr ':' CONTINUE                 #DoContinue
  ;

go_to
  : GO TO expr                                                                 #GoTo
  ;

label
  : expr ':' statement                                                         #LabelStatement
  | expr ':' CONTINUE                                                          #LabelContinue
  ;

call
  : CALL expr_or_assign
  ;

variable
  :  VARIABLE expr_or_assign
  ;

type
  :  DIMENSION expr (COMMA expr)*                                              #DimensionType
  |  REAL expr (COMMA expr)*                                                   #RealType
  |  DOUBLEPRECISION expr (COMMA expr)*                                        #DoublePrecisionType
  |  INTEGER expr (COMMA expr)*                                                #IntegerType
  |  LOGICAL expr (COMMA expr)*                                                #LogicalType
  |  CHARACTER expr (COMMA expr)*                                              #CharacterType
  ;

procedural
  : PROCEDURAL ('(' ID? (COMMA ID)* EQUALS? ID? (COMMA ID)* ')')? (statement|comment)* END comment      #ProceduralWithComment
  | PROCEDURAL ('(' ID? (COMMA ID)* EQUALS? ID? (COMMA ID)* ')')? (statement|comment)* END              #ProceduralWithoutComment
  ;

expr_or_assign
  :   expr EQUALS expr_or_assign (';')* comment                                                         #AssignExprOrAssignWithComment
  |   expr EQUALS expr_or_assign (';')*                                                                 #AssignExprOrAssign
  |   expr EQUALS expr COMMA expr (COMMA expr)* comment                                                 #ListExprOrAssignWithComment
  |   expr EQUALS expr COMMA expr (COMMA expr)*                                                         #ListExprOrAssign
  |   expr EQUALS expr COMMA expr EQUALS expr (COMMA expr EQUALS expr)* comment                         #MultipleExprOrAssignWithComment
  |   expr EQUALS expr COMMA expr EQUALS expr (COMMA expr EQUALS expr)*                                 #MultipleExprOrAssign
  |   expr EQUALS expr COMMA expr (COMMA expr)*                                                         #ListExprOrAssign
  |   expr                                                                                              #ExprExprOrAssign
  ;

expr
  :   <assoc=right> expr ('**'|'^') expr                                       #ExpExpr
  |   ('-'|'+') expr                                                           #UnaryExpr
  |   expr ('*'|'/') expr                                                      #MulDivExpr
  |   expr ('+'|'-') expr                                                      #AddSubExpr
  |   NOT expr                                                                 #NotExpr
  |   (TRUE|FALSE)                                                             #BoolExpr
  |   expr (AND|EQ|GE|GT|LE|LT|NE|OR|XOR|AT) expr                              #InfixExpr
  |   ID '(' (expr (COMMA expr)*)? ')'                                         #FnExpr
  |   '(' expr ')'                                                             #SubExpr
  |   STRING                                                                   #StrExpr
  |   ID                                                                       #IdExpr
  |   INT                                                                      #IntExpr
  |   FLOAT                                                                    #FloatExpr
  ;

comment
  :   COMMENT
  ;


fragment A
  : ('a' | 'A')
  ;

fragment B
  : ('b' | 'B')
  ;

fragment C
  : ('c' | 'C')
  ;

fragment D
  : ('d' | 'D')
  ;

fragment E
  : ('e' | 'E')
  ;

fragment F
  : ('f' | 'F')
  ;

fragment G
  : ('g' | 'G')
  ;

fragment H
  : ('h' | 'H')
  ;

fragment I
  : ('i' | 'I')
  ;

fragment J
  : ('j' | 'J')
  ;

fragment K
  : ('k' | 'K')
  ;

fragment L
  : ('l' | 'L')
  ;

fragment M
  : ('m' | 'M')
  ;

fragment N
  : ('n' | 'N')
  ;

fragment O
  : ('o' | 'O')
  ;

fragment P
  : ('p' | 'P')
  ;

fragment Q
  : ('q' | 'Q')
  ;

fragment R
  : ('r' | 'R')
  ;

fragment S
  : ('s' | 'S')
  ;

fragment T
  : ('t' | 'T')
  ;

fragment U
  : ('u' | 'U')
  ;

fragment V
  : ('v' | 'V')
  ;

fragment W
  : ('w' | 'W')
  ;

fragment X
  : ('x' | 'X')
  ;

fragment Y
  : ('y' | 'Y')
  ;

fragment Z
  : ('z' | 'Z')
  ;

PROGRAM
  : P R O G R A M
  ;

END
  : E N D
  ;

DISCRETE
  : D I S C R E T E
  ;

INTERVAL
  : I N T E R V A L
  ;

SCHEDULE
  : S C H E D U L E
  ;

INITIAL
  : I N I T I A L
  ;

TERMINAL
  : T E R M I N A L
  ;

CONSTANT
  : C O N S T A N T
  ;

DYNAMIC
  : D Y N A M I C
  ;

ALGORITHM
  : A L G O R I T H M
  ;

MAXTERVAL
  : M A X T E R V A L
  ;

MINTERVAL
  : M I N T E R V A L
  ;

CINTERVAL
  : C I N T E R V A L
  ;

NSTEPS
  : N S T E P S
  ;

DERIVATIVE
  : D E R I V A T I V E
  ;

AND
  : '__' A N D
  ;

EQ
  : '__' E Q
  ;

GE
  : '__' G E
  ;

GT
  : '__' G T
  | GREATERTHAN
  ;

LE
  : '__' L E
  ;

LT
  : '__' L T
  | LESSTHAN
  ;

NE
  : '__' N E
  ;

OR
  : '__' O R
  ;

XOR
  : '__' X O R
  ;

AT
  : '__' A T
  ;

IF
  : I F
  ;

THEN
  : T H E N
  ;

ELSE
  : E L S E
  ;

ENDIF
  : E N D I F
  ;

ENDSPACEIF
  : E N D (' ')+ I F
  ;

PROCEDURAL
  : P R O C E D U R A L
  ;

TRUE
  : '__' T R U E
  ;

FALSE
  : '__' F A L S E
  ;

NOT
  : '__' N O T
  ;

TABLE
  : T A B L E
  ;

PARAMETER
  : P A R A M E T E R
  ;

DO
  : D O
  ;

CONTINUE
  : C O N T I N U E
  ;
  
GO
  : G O
  ;

TO
  : T O
  ;

CALL
  : C A L L
  ;

VARIABLE
  : V A R I A B L E
  ;

DIMENSION
  : D I M E N S I O N
  ;

REAL
  : R E A L
  ;

DOUBLEPRECISION
  : D O U B L E P R E C I S I O N
  ;

INTEGER
  : I N T E G E R
  ;

LOGICAL
  : L O G I C A L
  ;

CHARACTER
  : C H A R A C T E R
  ;

STRING
  : '\'' (~['\\])* '\''
  ;

INT
  :  DIGIT+ 
  ;

FLOAT
  :  DIGIT+ '.' DIGIT* EXPONENT?
  |  DIGIT+ EXPONENT
  |  '.' DIGIT+ EXPONENT?
  ;

ID
  : (LETTER|'_') (LETTER|DIGIT|'_')*
  | LETTER (LETTER|DIGIT|'_')*
  ;

fragment DIGIT
  :  '0'..'9' 
  ; 

fragment EXPONENT
  :  ('E' | 'e') ('+' | '-')? INT
  ;

fragment LETTER  
  :  [a-zA-Z]
  ;

EQUALS
  :  '='
  ;

LESSTHAN
  :  '<'
  ;

GREATERTHAN
  :  '>'
  ;

COMMA
  :  ','
  ;

SLASH
  :  '/'
  ;

COMMENT
  :  '!' ~[\r\n]* '\r'? '\n'
  ;

WS  
  :  [ \t\n\r]+ -> skip
  ;
