/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { EqualityComparator } from './EqualityComparator';
import { JavaCollection, JavaMap, JavaSet } from './Stubs';
export declare class Array2DHashMap<K, V> implements JavaMap<K, V> {
    private backingStore;
    constructor(keyComparer: EqualityComparator<K>);
    constructor(map: Array2DHashMap<K, V>);
    clear(): void;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    entrySet(): JavaSet<JavaMap.Entry<K, V>>;
    get(key: K): V | undefined;
    readonly isEmpty: boolean;
    keySet(): JavaSet<K>;
    put(key: K, value: V): V | undefined;
    putIfAbsent(key: K, value: V): V | undefined;
    putAll<K2 extends K, V2 extends V>(m: JavaMap<K2, V2>): void;
    remove(key: K): V | undefined;
    readonly size: number;
    values(): JavaCollection<V>;
    hashCode(): number;
    equals(o: any): boolean;
}
