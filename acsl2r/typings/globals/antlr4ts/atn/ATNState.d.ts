/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATN } from './ATN';
import { ATNStateType } from './ATNStateType';
import { IntervalSet } from '../misc/IntervalSet';
import { Transition } from './Transition';
/**
 * The following images show the relation of states and
 * {@link ATNState#transitions} for various grammar constructs.
 *
 * <ul>
 *
 * <li>Solid edges marked with an &#0949; indicate a required
 * {@link EpsilonTransition}.</li>
 *
 * <li>Dashed edges indicate locations where any transition derived from
 * {@link Transition} might appear.</li>
 *
 * <li>Dashed nodes are place holders for either a sequence of linked
 * {@link BasicState} states or the inclusion of a block representing a nested
 * construct in one of the forms below.</li>
 *
 * <li>Nodes showing multiple outgoing alternatives with a {@code ...} support
 * any number of alternatives (one or more). Nodes without the {@code ...} only
 * support the exact number of alternatives shown in the diagram.</li>
 *
 * </ul>
 *
 * <h2>Basic Blocks</h2>
 *
 * <h3>Rule</h3>
 *
 * <embed src="images/Rule.svg" type="image/svg+xml"/>
 *
 * <h3>Block of 1 or more alternatives</h3>
 *
 * <embed src="images/Block.svg" type="image/svg+xml"/>
 *
 * <h2>Greedy Loops</h2>
 *
 * <h3>Greedy Closure: {@code (...)*}</h3>
 *
 * <embed src="images/ClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Positive Closure: {@code (...)+}</h3>
 *
 * <embed src="images/PositiveClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Optional: {@code (...)?}</h3>
 *
 * <embed src="images/OptionalGreedy.svg" type="image/svg+xml"/>
 *
 * <h2>Non-Greedy Loops</h2>
 *
 * <h3>Non-Greedy Closure: {@code (...)*?}</h3>
 *
 * <embed src="images/ClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Positive Closure: {@code (...)+?}</h3>
 *
 * <embed src="images/PositiveClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Optional: {@code (...)??}</h3>
 *
 * <embed src="images/OptionalNonGreedy.svg" type="image/svg+xml"/>
 */
export declare abstract class ATNState {
    private static readonly serializationNames;
    /** Which ATN are we in? */
    atn?: ATN;
    stateNumber: number;
    ruleIndex: number;
    epsilonOnlyTransitions: boolean;
    /** Track the transitions emanating from this ATN state. */
    protected transitions: Transition[];
    protected optimizedTransitions: Transition[];
    /** Used to cache lookahead during parsing, not used during construction */
    nextTokenWithinRule?: IntervalSet;
    /**
     * Gets the state number.
     *
     * @return the state number
     */
    getStateNumber(): number;
    /**
     * For all states except {@link RuleStopState}, this returns the state
     * number. Returns -1 for stop states.
     *
     * @return -1 for {@link RuleStopState}, otherwise the state number
     */
    readonly nonStopStateNumber: number;
    hashCode(): number;
    equals(o: any): boolean;
    readonly isNonGreedyExitState: boolean;
    toString(): string;
    getTransitions(): Transition[];
    readonly numberOfTransitions: number;
    addTransition(e: Transition, index?: number): void;
    transition(i: number): Transition;
    setTransition(i: number, e: Transition): void;
    removeTransition(index: number): Transition;
    readonly abstract stateType: ATNStateType;
    readonly onlyHasEpsilonTransitions: boolean;
    setRuleIndex(ruleIndex: number): void;
    readonly isOptimized: boolean;
    readonly numberOfOptimizedTransitions: number;
    getOptimizedTransition(i: number): Transition;
    addOptimizedTransition(e: Transition): void;
    setOptimizedTransition(i: number, e: Transition): void;
    removeOptimizedTransition(i: number): void;
}
export declare namespace ATNState {
    const INVALID_STATE_NUMBER: number;
}
