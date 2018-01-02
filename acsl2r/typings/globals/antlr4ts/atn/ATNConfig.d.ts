/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNState } from './ATNState';
import { Equatable } from '../misc/Stubs';
import { LexerActionExecutor } from './LexerActionExecutor';
import { PredictionContext } from './PredictionContext';
import { PredictionContextCache } from './PredictionContextCache';
import { Recognizer } from '../Recognizer';
import { SemanticContext } from './SemanticContext';
/** A tuple: (ATN state, predicted alt, syntactic, semantic context).
 *  The syntactic context is a graph-structured stack node whose
 *  path(s) to the root is the rule invocation(s)
 *  chain used to arrive at the state.  The semantic context is
 *  the tree of semantic predicates encountered before reaching
 *  an ATN state.
 */
export declare class ATNConfig implements Equatable {
    /** The ATN state associated with this configuration */
    private _state;
    /**
     * This is a bit-field currently containing the following values.
     *
     * <ul>
     * <li>0x00FFFFFF: Alternative</li>
     * <li>0x7F000000: Outer context depth</li>
     * <li>0x80000000: Suppress precedence filter</li>
     * </ul>
     */
    private altAndOuterContextDepth;
    /** The stack of invoking states leading to the rule/states associated
     *  with this config.  We track only those contexts pushed during
     *  execution of the ATN simulator.
     */
    private _context;
    constructor(state: ATNState, alt: number, context: PredictionContext);
    constructor(state: ATNState, c: ATNConfig, context: PredictionContext);
    static create(state: ATNState, alt: number, context: PredictionContext): ATNConfig;
    static create(state: ATNState, alt: number, context: PredictionContext, semanticContext: SemanticContext): ATNConfig;
    static create(state: ATNState, alt: number, context: PredictionContext, semanticContext: SemanticContext, lexerActionExecutor: LexerActionExecutor | undefined): ATNConfig;
    /** Gets the ATN state associated with this configuration */
    readonly state: ATNState;
    /** What alt (or lexer rule) is predicted by this configuration */
    readonly alt: number;
    context: PredictionContext;
    readonly reachesIntoOuterContext: boolean;
    /**
     * We cannot execute predicates dependent upon local context unless
     * we know for sure we are in the correct context. Because there is
     * no way to do this efficiently, we simply cannot evaluate
     * dependent predicates unless we are in the rule that initially
     * invokes the ATN simulator.
     *
     * <p>
     * closure() tracks the depth of how far we dip into the outer context:
     * depth &gt; 0.  Note that it may not be totally accurate depth since I
     * don't ever decrement. TODO: make it a boolean then</p>
     */
    outerContextDepth: number;
    readonly lexerActionExecutor: LexerActionExecutor | undefined;
    readonly semanticContext: SemanticContext;
    readonly hasPassedThroughNonGreedyDecision: boolean;
    clone(): ATNConfig;
    transform(state: ATNState, checkNonGreedy: boolean): ATNConfig;
    transform(state: ATNState, checkNonGreedy: boolean, semanticContext: SemanticContext): ATNConfig;
    transform(state: ATNState, checkNonGreedy: boolean, context: PredictionContext): ATNConfig;
    transform(state: ATNState, checkNonGreedy: boolean, lexerActionExecutor: LexerActionExecutor): ATNConfig;
    private transformImpl(state, context, semanticContext, checkNonGreedy, lexerActionExecutor);
    private static checkNonGreedyDecision(source, target);
    appendContext(context: number, contextCache: PredictionContextCache): ATNConfig;
    appendContext(context: PredictionContext, contextCache: PredictionContextCache): ATNConfig;
    contains(subconfig: ATNConfig): boolean;
    isPrecedenceFilterSuppressed: boolean;
    /** An ATN configuration is equal to another if both have
     *  the same state, they predict the same alternative, and
     *  syntactic/semantic contexts are the same.
     */
    equals(o: any): boolean;
    hashCode(): number;
    toDotString(): string;
    toString(): string;
    toString(recog: Recognizer<any, any> | undefined, showAlt: boolean): string;
    toString(recog: Recognizer<any, any> | undefined, showAlt: boolean, showContext: boolean): string;
}
