/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { ATN } from "./atn/ATN";
import { ATNSimulator } from "./atn/ATNSimulator";
import { IntStream } from "./IntStream";
import { ParseInfo } from "./atn/ParseInfo";
import { RecognitionException } from "./RecognitionException";
import { RuleContext } from "./RuleContext";
import { Vocabulary } from "./Vocabulary";
export declare abstract class Recognizer<Symbol, ATNInterpreter extends ATNSimulator> {
    static readonly EOF: number;
    private static tokenTypeMapCache;
    private static ruleIndexMapCache;
    private readonly _listeners;
    protected _interp: ATNInterpreter;
    private _stateNumber;
    readonly abstract ruleNames: string[];
    /**
     * Get the vocabulary used by the recognizer.
     *
     * @return A {@link Vocabulary} instance providing information about the
     * vocabulary used by the grammar.
     */
    readonly abstract vocabulary: Vocabulary;
    /**
     * Get a map from token names to token types.
     *
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    getTokenTypeMap(): ReadonlyMap<string, number>;
    /**
     * Get a map from rule names to rule indexes.
     *
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    getRuleIndexMap(): ReadonlyMap<string, number>;
    getTokenType(tokenName: string): number;
    /**
     * If this recognizer was generated, it will have a serialized ATN
     * representation of the grammar.
     *
     * <p>For interpreters, we don't know their serialized ATN despite having
     * created the interpreter from it.</p>
     */
    readonly serializedATN: string;
    /** For debugging and other purposes, might want the grammar name.
     *  Have ANTLR generate an implementation for this method.
     */
    readonly abstract grammarFileName: string;
    /**
     * Get the {@link ATN} used by the recognizer for prediction.
     *
     * @return The {@link ATN} used by the recognizer for prediction.
     */
    readonly atn: ATN;
    /**
     * Get the ATN interpreter used by the recognizer for prediction.
     *
     * @return The ATN interpreter used by the recognizer for prediction.
     */
    /**
     * Set the ATN interpreter used by the recognizer for prediction.
     *
     * @param interpreter The ATN interpreter used by the recognizer for
     * prediction.
     */
    interpreter: ATNInterpreter;
    /** If profiling during the parse/lex, this will return DecisionInfo records
     *  for each decision in recognizer in a ParseInfo object.
     *
     * @since 4.3
     */
    readonly parseInfo: ParseInfo | undefined;
    /** What is the error header, normally line/character position information? */
    getErrorHeader(e: RecognitionException): string;
    /**
     * @exception NullPointerException if {@code listener} is {@code null}.
     */
    addErrorListener(listener: ANTLRErrorListener<Symbol>): void;
    removeErrorListener(listener: ANTLRErrorListener<Symbol>): void;
    removeErrorListeners(): void;
    getErrorListeners(): ANTLRErrorListener<Symbol>[];
    getErrorListenerDispatch(): ANTLRErrorListener<Symbol>;
    sempred(_localctx: RuleContext | undefined, ruleIndex: number, actionIndex: number): boolean;
    precpred(localctx: RuleContext | undefined, precedence: number): boolean;
    action(_localctx: RuleContext | undefined, ruleIndex: number, actionIndex: number): void;
    /** Indicate that the recognizer has changed internal state that is
     *  consistent with the ATN state passed in.  This way we always know
     *  where we are in the ATN as the parser goes along. The rule
     *  context objects form a stack that lets us see the stack of
     *  invoking rules. Combine this and we have complete ATN
     *  configuration information.
     */
    state: number;
    readonly abstract inputStream: IntStream | undefined;
}
