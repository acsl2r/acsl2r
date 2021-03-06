/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Array2DHashSet } from '../misc/Array2DHashSet';
import { ATNConfig } from './ATNConfig';
import { ATNSimulator } from './ATNSimulator';
import { ATNState } from './ATNState';
import { BitSet } from '../misc/BitSet';
import { Collection, JavaIterator } from '../misc/Stubs';
import { ConflictInfo } from './ConflictInfo';
import { JavaSet } from '../misc/Stubs';
import { PredictionContextCache } from './PredictionContextCache';
/**
 *
 * @author Sam Harwell
 */
export declare class ATNConfigSet implements JavaSet<ATNConfig> {
    /**
     * This maps (state, alt) -> merged {@link ATNConfig}. The key does not account for
     * the {@link ATNConfig#getSemanticContext} of the value, which is only a problem if a single
     * {@code ATNConfigSet} contains two configs with the same state and alternative
     * but different semantic contexts. When this case arises, the first config
     * added to this map stays, and the remaining configs are placed in {@link #unmerged}.
     * <p>
     * This map is only used for optimizing the process of adding configs to the set,
     * and is {@code null} for read-only sets stored in the DFA.
     */
    private mergedConfigs?;
    /**
     * This is an "overflow" list holding configs which cannot be merged with one
     * of the configs in {@link #mergedConfigs} but have a colliding key. This
     * occurs when two configs in the set have the same state and alternative but
     * different semantic contexts.
     * <p>
     * This list is only used for optimizing the process of adding configs to the set,
     * and is {@code null} for read-only sets stored in the DFA.
     */
    private unmerged?;
    /**
     * This is a list of all configs in this set.
     */
    private configs;
    private _uniqueAlt;
    private _conflictInfo?;
    private _hasSemanticContext;
    private _dipsIntoOuterContext;
    /**
     * When {@code true}, this config set represents configurations where the entire
     * outer context has been consumed by the ATN interpreter. This prevents the
     * {@link ParserATNSimulator#closure} from pursuing the global FOLLOW when a
     * rule stop state is reached with an empty prediction context.
     * <p>
     * Note: {@code outermostConfigSet} and {@link #dipsIntoOuterContext} should never
     * be true at the same time.
     */
    private outermostConfigSet;
    private cachedHashCode;
    constructor();
    constructor(set: ATNConfigSet, readonly: boolean);
    /**
     * Get the set of all alternatives represented by configurations in this
     * set.
     */
    getRepresentedAlternatives(): BitSet;
    readonly isReadOnly: boolean;
    isOutermostConfigSet: boolean;
    getStates(): Array2DHashSet<ATNState>;
    optimizeConfigs(interpreter: ATNSimulator): void;
    clone(readonly: boolean): ATNConfigSet;
    readonly size: number;
    readonly isEmpty: boolean;
    contains(o: any): boolean;
    iterator(): JavaIterator<ATNConfig>;
    toArray(): ATNConfig[];
    toArray(a?: ATNConfig[]): ATNConfig[];
    add(e: ATNConfig): boolean;
    add(e: ATNConfig, contextCache: PredictionContextCache | undefined): boolean;
    private updatePropertiesForMergedConfig(config);
    private updatePropertiesForAddedConfig(config);
    protected canMerge(left: ATNConfig, leftKey: {
        state: number;
        alt: number;
    }, right: ATNConfig): boolean;
    protected getKey(e: ATNConfig): {
        state: number;
        alt: number;
    };
    containsAll(c: Collection<any>): boolean;
    addAll(c: Collection<ATNConfig>): boolean;
    addAll(c: Collection<ATNConfig>, contextCache: PredictionContextCache): boolean;
    retainAll(c: Collection<any>): boolean;
    removeAll(c: Collection<any>): boolean;
    clear(): void;
    equals(obj: any): boolean;
    hashCode(): number;
    toString(): string;
    toString(showContext: boolean): string;
    readonly uniqueAlt: number;
    hasSemanticContext: boolean;
    conflictInfo: ConflictInfo | undefined;
    readonly conflictingAlts: BitSet | undefined;
    readonly isExactConflict: boolean;
    readonly dipsIntoOuterContext: boolean;
    get(index: number): ATNConfig;
    remove(o: any): boolean;
    remove(index: number): void;
    protected ensureWritable(): void;
}
