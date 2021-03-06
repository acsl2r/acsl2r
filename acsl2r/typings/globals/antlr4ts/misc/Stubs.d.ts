/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
export interface Equatable {
    equals(other: any): boolean;
    hashCode(): number;
}
export interface Comparable<T> {
    compareTo(o: T): number;
}
export interface JavaIterator<E> {
    hasNext(): boolean;
    next(): E;
    remove(): void;
}
export interface JavaIterable<E> {
    iterator(): JavaIterator<E>;
}
export interface JavaCollection<E> extends JavaIterable<E> {
    add(e: E): boolean;
    addAll(collection: Collection<E>): boolean;
    clear(): void;
    contains(o: any): boolean;
    containsAll(collection: Collection<any>): boolean;
    equals(o: any): boolean;
    hashCode(): number;
    readonly isEmpty: boolean;
    iterator(): JavaIterator<E>;
    remove(o: any): boolean;
    removeAll(collection: Collection<any>): boolean;
    retainAll(collection: Collection<any>): boolean;
    readonly size: number;
    toArray(): any[];
    toArray(a: E[]): E[];
}
export interface JavaSet<E> extends JavaCollection<E> {
}
export interface JavaMap<K, V> extends Equatable {
    clear(): void;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    entrySet(): JavaSet<JavaMap.Entry<K, V>>;
    get(key: K): V | undefined;
    readonly isEmpty: boolean;
    keySet(): JavaSet<K>;
    put(key: K, value: V): V | undefined;
    putAll<K2 extends K, V2 extends V>(m: JavaMap<K2, V2>): void;
    remove(key: K): V | undefined;
    readonly size: number;
    values(): JavaCollection<V>;
}
export declare namespace JavaMap {
    interface Entry<K, V> extends Equatable {
        getKey(): K;
        getValue(): V;
        setValue(value: V): V;
    }
}
/**
 * Collection is a hybrid type can accept either JavaCollection or JavaScript Iterable
 */
export declare type Collection<T> = JavaCollection<T> | Iterable<T>;
/**
 * This adapter function allows Collection<T> arguments to be used in JavaScript for...of loops
 */
export declare function asIterable<T>(collection: Collection<T>): Iterable<T>;
