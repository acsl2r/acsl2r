/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { CharStream } from './CharStream';
import { Token } from './Token';
import { TokenFactory } from './TokenFactory';
import { TokenSource } from './TokenSource';
/**
 * Provides an implementation of {@link TokenSource} as a wrapper around a list
 * of {@link Token} objects.
 *
 * <p>If the final token in the list is an {@link Token#EOF} token, it will be used
 * as the EOF token for every call to {@link #nextToken} after the end of the
 * list is reached. Otherwise, an EOF token will be created.</p>
 */
export declare class ListTokenSource implements TokenSource {
    /**
     * The wrapped collection of {@link Token} objects to return.
     */
    protected tokens: Token[];
    /**
     * The name of the input source. If this value is {@code null}, a call to
     * {@link #getSourceName} should return the source name used to create the
     * the next token in {@link #tokens} (or the previous token if the end of
     * the input has been reached).
     */
    private _sourceName?;
    /**
     * The index into {@link #tokens} of token to return by the next call to
     * {@link #nextToken}. The end of the input is indicated by this value
     * being greater than or equal to the number of items in {@link #tokens}.
     */
    protected i: number;
    /**
     * This field caches the EOF token for the token source.
     */
    protected eofToken?: Token;
    /**
     * This is the backing field for {@link #getTokenFactory} and
     * {@link setTokenFactory}.
     */
    private _factory;
    /**
     * Constructs a new {@link ListTokenSource} instance from the specified
     * collection of {@link Token} objects and source name.
     *
     * @param tokens The collection of {@link Token} objects to provide as a
     * {@link TokenSource}.
     * @param sourceName The name of the {@link TokenSource}. If this value is
     * {@code null}, {@link #getSourceName} will attempt to infer the name from
     * the next {@link Token} (or the previous token if the end of the input has
     * been reached).
     *
     * @exception NullPointerException if {@code tokens} is {@code null}
     */
    constructor(tokens: Token[], sourceName?: string);
    /**
     * {@inheritDoc}
     */
    readonly charPositionInLine: number;
    /**
     * {@inheritDoc}
     */
    nextToken(): Token;
    /**
     * {@inheritDoc}
     */
    readonly line: number;
    /**
     * {@inheritDoc}
     */
    readonly inputStream: CharStream | undefined;
    /**
     * {@inheritDoc}
     */
    readonly sourceName: string;
    /**
     * {@inheritDoc}
     */
    /**
     * {@inheritDoc}
     */
    tokenFactory: TokenFactory;
}
