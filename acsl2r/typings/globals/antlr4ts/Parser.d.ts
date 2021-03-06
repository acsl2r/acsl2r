/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ANTLRErrorStrategy } from './ANTLRErrorStrategy';
import { ATN } from './atn/ATN';
import { IntegerStack } from './misc/IntegerStack';
import { IntervalSet } from './misc/IntervalSet';
import { Lexer } from './Lexer';
import { ParseInfo } from './atn/ParseInfo';
import { ParserATNSimulator } from './atn/ParserATNSimulator';
import { ParserErrorListener } from './ParserErrorListener';
import { ParserRuleContext } from './ParserRuleContext';
import { ParseTreeListener } from './tree/ParseTreeListener';
import { ParseTreePattern } from './tree/pattern/ParseTreePattern';
import { RecognitionException } from './RecognitionException';
import { Recognizer } from './Recognizer';
import { RuleContext } from './RuleContext';
import { Token } from './Token';
import { TokenFactory } from './TokenFactory';
import { TokenStream } from './TokenStream';
/** This is all the parsing support code essentially; most of it is error recovery stuff. */
export declare abstract class Parser extends Recognizer<Token, ParserATNSimulator> {
    /**
     * This field maps from the serialized ATN string to the deserialized {@link ATN} with
     * bypass alternatives.
     *
     * @see ATNDeserializationOptions.isGenerateRuleBypassTransitions
     */
    private static readonly bypassAltsAtnCache;
    /**
     * The error handling strategy for the parser. The default value is a new
     * instance of {@link DefaultErrorStrategy}.
     *
     * @see #getErrorHandler
     * @see #setErrorHandler
     */
    protected _errHandler: ANTLRErrorStrategy;
    /**
     * The input stream.
     *
     * @see #getInputStream
     * @see #setInputStream
     */
    protected _input: TokenStream;
    protected readonly _precedenceStack: IntegerStack;
    /**
     * The {@link ParserRuleContext} object for the currently executing rule.
     *
     * This is always non-null during the parsing process.
     */
    protected _ctx: ParserRuleContext;
    /**
     * Specifies whether or not the parser should construct a parse tree during
     * the parsing process. The default value is `true`.
     *
     * @see `buildParseTree`
     */
    private _buildParseTrees;
    /**
     * When {@link #setTrace}{@code (true)} is called, a reference to the
     * {@link TraceListener} is stored here so it can be easily removed in a
     * later call to {@link #setTrace}{@code (false)}. The listener itself is
     * implemented as a parser listener so this field is not directly used by
     * other parser methods.
     */
    private _tracer;
    /**
     * The list of {@link ParseTreeListener} listeners registered to receive
     * events during the parse.
     *
     * @see #addParseListener
     */
    protected _parseListeners: ParseTreeListener[];
    /**
     * The number of syntax errors reported during parsing. This value is
     * incremented each time {@link #notifyErrorListeners} is called.
     */
    protected _syntaxErrors: number;
    /** Indicates parser has match()ed EOF token. See {@link #exitRule()}. */
    protected matchedEOF: boolean;
    constructor(input: TokenStream);
    /** reset the parser's state */
    reset(): void;
    reset(resetInput: boolean): void;
    /**
     * Match current input symbol against {@code ttype}. If the symbol type
     * matches, {@link ANTLRErrorStrategy#reportMatch} and {@link #consume} are
     * called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy#recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link #getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy#recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext#addErrorNode}.</p>
     *
     * @param ttype the token type to match
     * @return the matched symbol
     * @ if the current input symbol did not match
     * {@code ttype} and the error strategy could not recover from the
     * mismatched symbol
     */
    match(ttype: number): Token;
    /**
     * Match current input symbol as a wildcard. If the symbol type matches
     * (i.e. has a value greater than 0), {@link ANTLRErrorStrategy#reportMatch}
     * and {@link #consume} are called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy#recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link #getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy#recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext#addErrorNode}.</p>
     *
     * @return the matched symbol
     * @ if the current input symbol did not match
     * a wildcard and the error strategy could not recover from the mismatched
     * symbol
     */
    matchWildcard(): Token;
    /**
     * Gets whether or not a complete parse tree will be constructed while
     * parsing. This property is {@code true} for a newly constructed parser.
     *
     * @return {@code true} if a complete parse tree will be constructed while
     * parsing, otherwise {@code false}
     */
    /**
     * Track the {@link ParserRuleContext} objects during the parse and hook
     * them up using the {@link ParserRuleContext#children} list so that it
     * forms a parse tree. The {@link ParserRuleContext} returned from the start
     * rule represents the root of the parse tree.
     *
     * <p>Note that if we are not building parse trees, rule contexts only point
     * upwards. When a rule exits, it returns the context but that gets garbage
     * collected if nobody holds a reference. It points upwards but nobody
     * points at it.</p>
     *
     * <p>When we build parse trees, we are adding all of these contexts to
     * {@link ParserRuleContext#children} list. Contexts are then not candidates
     * for garbage collection.</p>
     */
    buildParseTree: boolean;
    getParseListeners(): ParseTreeListener[];
    /**
     * Registers {@code listener} to receive events during the parsing process.
     *
     * <p>To support output-preserving grammar transformations (including but not
     * limited to left-recursion removal, automated left-factoring, and
     * optimized code generation), calls to listener methods during the parse
     * may differ substantially from calls made by
     * {@link ParseTreeWalker#DEFAULT} used after the parse is complete. In
     * particular, rule entry and exit events may occur in a different order
     * during the parse than after the parser. In addition, calls to certain
     * rule entry methods may be omitted.</p>
     *
     * <p>With the following specific exceptions, calls to listener events are
     * <em>deterministic</em>, i.e. for identical input the calls to listener
     * methods will be the same.</p>
     *
     * <ul>
     * <li>Alterations to the grammar used to generate code may change the
     * behavior of the listener calls.</li>
     * <li>Alterations to the command line options passed to ANTLR 4 when
     * generating the parser may change the behavior of the listener calls.</li>
     * <li>Changing the version of the ANTLR Tool used to generate the parser
     * may change the behavior of the listener calls.</li>
     * </ul>
     *
     * @param listener the listener to add
     *
     * @ if {@code} listener is {@code null}
     */
    addParseListener(listener: ParseTreeListener): void;
    /**
     * Remove {@code listener} from the list of parse listeners.
     *
     * <p>If {@code listener} is {@code null} or has not been added as a parse
     * listener, this method does nothing.</p>
     *
     * @see #addParseListener
     *
     * @param listener the listener to remove
     */
    removeParseListener(listener: ParseTreeListener): void;
    /**
     * Remove all parse listeners.
     *
     * @see #addParseListener
     */
    removeParseListeners(): void;
    /**
     * Notify any parse listeners of an enter rule event.
     *
     * @see #addParseListener
     */
    protected triggerEnterRuleEvent(): void;
    /**
     * Notify any parse listeners of an exit rule event.
     *
     * @see #addParseListener
     */
    protected triggerExitRuleEvent(): void;
    /**
     * Gets the number of syntax errors reported during parsing. This value is
     * incremented each time {@link #notifyErrorListeners} is called.
     *
     * @see #notifyErrorListeners
     */
    readonly numberOfSyntaxErrors: number;
    readonly tokenFactory: TokenFactory;
    /**
     * The ATN with bypass alternatives is expensive to create so we create it
     * lazily.
     *
     * @ if the current parser does not
     * implement the `serializedATN` property.
     */
    getATNWithBypassAlts(): ATN;
    /**
     * The preferred method of getting a tree pattern. For example, here's a
     * sample use:
     *
     * <pre>
     * ParseTree t = parser.expr();
     * ParseTreePattern p = parser.compileParseTreePattern("&lt;ID&gt;+0", MyParser.RULE_expr);
     * ParseTreeMatch m = p.match(t);
     * String id = m.get("ID");
     * </pre>
     */
    compileParseTreePattern(pattern: string, patternRuleIndex: number): ParseTreePattern;
    /**
     * The same as {@link #compileParseTreePattern(String, int)} but specify a
     * {@link Lexer} rather than trying to deduce it from this parser.
     */
    compileParseTreePattern(pattern: string, patternRuleIndex: number, lexer?: Lexer): ParseTreePattern;
    errorHandler: ANTLRErrorStrategy;
    /** Set the token stream and reset the parser. */
    inputStream: TokenStream;
    /** Match needs to return the current input symbol, which gets put
     *  into the label for the associated token ref; e.g., x=ID.
     */
    readonly currentToken: Token;
    notifyErrorListeners(msg: string): void;
    notifyErrorListeners(msg: string, offendingToken: Token | null, e: RecognitionException | undefined): void;
    /**
     * Consume and return the [current symbol](`currentToken`).
     *
     * <p>E.g., given the following input with {@code A} being the current
     * lookahead symbol, this function moves the cursor to {@code B} and returns
     * {@code A}.</p>
     *
     * <pre>
     *  A B
     *  ^
     * </pre>
     *
     * If the parser is not in error recovery mode, the consumed symbol is added
     * to the parse tree using {@link ParserRuleContext#addChild(Token)}, and
     * {@link ParseTreeListener#visitTerminal} is called on any parse listeners.
     * If the parser <em>is</em> in error recovery mode, the consumed symbol is
     * added to the parse tree using
     * {@link ParserRuleContext#addErrorNode(Token)}, and
     * {@link ParseTreeListener#visitErrorNode} is called on any parse
     * listeners.
     */
    consume(): Token;
    protected addContextToParseTree(): void;
    /**
     * Always called by generated parsers upon entry to a rule. Access field
     * {@link #_ctx} get the current context.
     */
    enterRule(localctx: ParserRuleContext, state: number, ruleIndex: number): void;
    enterLeftFactoredRule(localctx: ParserRuleContext, state: number, ruleIndex: number): void;
    exitRule(): void;
    enterOuterAlt(localctx: ParserRuleContext, altNum: number): void;
    /**
     * Get the precedence level for the top-most precedence rule.
     *
     * @return The precedence level for the top-most precedence rule, or -1 if
     * the parser context is not nested within a precedence rule.
     */
    readonly precedence: number;
    enterRecursionRule(localctx: ParserRuleContext, state: number, ruleIndex: number, precedence: number): void;
    /** Like {@link #enterRule} but for recursive rules.
     *  Make the current context the child of the incoming localctx.
     */
    pushNewRecursionContext(localctx: ParserRuleContext, state: number, ruleIndex: number): void;
    unrollRecursionContexts(_parentctx: ParserRuleContext): void;
    getInvokingContext(ruleIndex: number): ParserRuleContext | undefined;
    context: ParserRuleContext;
    precpred(localctx: RuleContext, precedence: number): boolean;
    getErrorListenerDispatch(): ParserErrorListener;
    inContext(context: string): boolean;
    /**
     * Checks whether or not {@code symbol} can follow the current state in the
     * ATN. The behavior of this method is equivalent to the following, but is
     * implemented such that the complete context-sensitive follow set does not
     * need to be explicitly constructed.
     *
     * <pre>
     * return getExpectedTokens().contains(symbol);
     * </pre>
     *
     * @param symbol the symbol type to check
     * @return {@code true} if {@code symbol} can follow the current state in
     * the ATN, otherwise {@code false}.
     */
    isExpectedToken(symbol: number): boolean;
    readonly isMatchedEOF: boolean;
    /**
     * Computes the set of input symbols which could follow the current parser
     * state and context, as given by {@link #getState} and {@link #getContext},
     * respectively.
     *
     * @see ATN#getExpectedTokens(int, RuleContext)
     */
    getExpectedTokens(): IntervalSet;
    getExpectedTokensWithinCurrentRule(): IntervalSet;
    /** Get a rule's index (i.e., {@code RULE_ruleName} field) or -1 if not found. */
    getRuleIndex(ruleName: string): number;
    readonly ruleContext: ParserRuleContext;
    /** Return List&lt;String&gt; of the rule names in your parser instance
     *  leading up to a call to the current rule.  You could override if
     *  you want more details such as the file/line info of where
     *  in the ATN a rule is invoked.
     *
     *  This is very useful for error messages.
     */
    getRuleInvocationStack(p?: RuleContext | undefined): string[];
    /** For debugging and other purposes. */
    getDFAStrings(): string[];
    /** For debugging and other purposes. */
    dumpDFA(): void;
    readonly sourceName: string;
    readonly parseInfo: ParseInfo | undefined;
    /**
     * @since 4.3
     */
    setProfile(profile: boolean): void;
    /**
     * Gets whether a {@link TraceListener} is registered as a parse listener
     * for the parser.
     */
    /** During a parse is sometimes useful to listen in on the rule entry and exit
     *  events as well as token matches. This is for quick and dirty debugging.
     */
    isTrace: boolean;
}
