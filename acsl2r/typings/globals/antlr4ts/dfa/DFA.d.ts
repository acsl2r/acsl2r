/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Array2DHashSet } from '../misc/Array2DHashSet';
import { ATN } from '../atn/ATN';
import { ATNState } from '../atn/ATNState';
import { DFAState } from './DFAState';
import { Vocabulary } from '../Vocabulary';
export declare class DFA {
    /**
     * A set of all states in the `DFA`.
     */
    readonly states: Array2DHashSet<DFAState>;
    s0: DFAState | undefined;
    s0full: DFAState | undefined;
    readonly decision: number;
    /** From which ATN state did we create this DFA? */
    atnStartState: ATNState;
    /**
     * Note: this field is accessed as `atnStartState.atn` in other targets. The TypeScript target keeps a separate copy
     * to avoid a number of additional null/undefined checks each time the ATN is accessed.
     */
    atn: ATN;
    private nextStateNumber;
    /**
     * {@code true} if this DFA is for a precedence decision; otherwise,
     * {@code false}. This is the backing field for {@link #isPrecedenceDfa}.
     */
    private precedenceDfa;
    constructor(atnStartState: ATNState, decision?: number);
    /**
     * Gets whether this DFA is a precedence DFA. Precedence DFAs use a special
     * start state {@link #s0} which is not stored in {@link #states}. The
     * {@link DFAState#edges} array for this start state contains outgoing edges
     * supplying individual start states corresponding to specific precedence
     * values.
     *
     * @return {@code true} if this is a precedence DFA; otherwise,
     * {@code false}.
     * @see Parser.precedence
     */
    readonly isPrecedenceDfa: boolean;
    /**
     * Get the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @return The start state corresponding to the specified precedence, or
     * {@code null} if no start state exists for the specified precedence.
     *
     * @ if this is not a precedence DFA.
     * @see `isPrecedenceDfa`
     */
    getPrecedenceStartState(precedence: number, fullContext: boolean): DFAState | undefined;
    /**
     * Set the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @param startState The start state corresponding to the specified
     * precedence.
     *
     * @ if this is not a precedence DFA.
     * @see `isPrecedenceDfa`
     */
    setPrecedenceStartState(precedence: number, fullContext: boolean, startState: DFAState): void;
    readonly isEmpty: boolean;
    readonly isContextSensitive: boolean;
    addState(state: DFAState): DFAState;
    toString(): string;
    toString(vocabulary: Vocabulary): string;
    toString(vocabulary: Vocabulary, ruleNames: string[] | undefined): string;
    toLexerString(): string;
}
