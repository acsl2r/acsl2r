/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { EqualityComparator } from './EqualityComparator';
import { Collection, JavaIterator, JavaCollection, JavaSet } from './Stubs';
export declare class Array2DHashSet<T> implements JavaSet<T> {
    protected comparator: EqualityComparator<T>;
    protected buckets: (T | undefined)[][];
    /** How many elements in set */
    protected n: number;
    protected threshold: number;
    protected initialBucketCapacity: number;
    constructor(comparator?: EqualityComparator<T>, initialCapacity?: number, initialBucketCapacity?: number);
    constructor(set: Array2DHashSet<T>);
    /**
     * Add {@code o} to set if not there; return existing value if already
     * there. This method performs the same operation as {@link #add} aside from
     * the return value.
     */
    getOrAdd(o: T): T;
    protected getOrAddImpl(o: T): T;
    get(o: T): T | undefined;
    protected getBucket(o: T): number;
    hashCode(): number;
    equals(o: any): boolean;
    protected expand(): void;
    add(t: T): boolean;
    readonly size: number;
    readonly isEmpty: boolean;
    contains(o: any): boolean;
    containsFast(obj: T): boolean;
    iterator(): JavaIterator<T>;
    toArray(a?: any[]): T[];
    remove(o: any): boolean;
    removeFast(obj: T): boolean;
    containsAll(collection: JavaCollection<T>): boolean;
    addAll(c: Collection<T>): boolean;
    retainAll(c: JavaCollection<T>): boolean;
    removeAll(c: Collection<T>): boolean;
    clear(): void;
    toString(): string;
    toTableString(): string;
    /**
     * Return {@code o} as an instance of the element type {@code T}. If
     * {@code o} is non-null but known to not be an instance of {@code T}, this
     * method returns {@code null}. The base implementation does not perform any
     * type checks; override this method to provide strong type checks for the
     * {@link #contains} and {@link #remove} methods to ensure the arguments to
     * the {@link EqualityComparator} for the set always have the expected
     * types.
     *
     * @param o the object to try and cast to the element type of the set
     * @return {@code o} if it could be an instance of {@code T}, otherwise
     * {@code null}.
     */
    protected asElementType(o: any): T;
    /**
     * Return an array of {@code T[]} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
     * @return the newly constructed array
     */
    protected createBuckets(capacity: number): T[][];
    /**
     * Return an array of {@code T} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
     * @return the newly constructed array
     */
    protected createBucket(capacity: number): T[];
}
