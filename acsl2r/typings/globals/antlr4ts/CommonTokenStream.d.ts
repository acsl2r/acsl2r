/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { BufferedTokenStream } from './BufferedTokenStream';
import { Token } from './Token';
import { TokenSource } from './TokenSource';
/**
 * This class extends {@link BufferedTokenStream} with functionality to filter
 * token streams to tokens on a particular channel (tokens where
 * {@link Token#getChannel} returns a particular value).
 *
 * <p>
 * This token stream provides access to all tokens by index or when calling
 * methods like {@link #getText}. The channel filtering is only used for code
 * accessing tokens via the lookahead methods {@link #LA}, {@link #LT}, and
 * {@link #LB}.</p>
 *
 * <p>
 * By default, tokens are placed on the default channel
 * ({@link Token#DEFAULT_CHANNEL}), but may be reassigned by using the
 * {@code ->channel(HIDDEN)} lexer command, or by using an embedded action to
 * call {@link Lexer#setChannel}.
 * </p>
 *
 * <p>
 * Note: lexer rules which use the {@code ->skip} lexer command or call
 * {@link Lexer#skip} do not produce tokens at all, so input text matched by
 * such a rule will not be available as part of the token stream, regardless of
 * channel.</p>
 */
export declare class CommonTokenStream extends BufferedTokenStream {
    /**
     * Specifies the channel to use for filtering tokens.
     *
     * <p>
     * The default value is {@link Token#DEFAULT_CHANNEL}, which matches the
     * default channel assigned to tokens created by the lexer.</p>
     */
    protected channel: number;
    /**
     * Constructs a new {@link CommonTokenStream} using the specified token
     * source and filtering tokens to the specified channel. Only tokens whose
     * {@link Token#getChannel} matches {@code channel} or have the
     * `Token.type` equal to {@link Token#EOF} will be returned by the
     * token stream lookahead methods.
     *
     * @param tokenSource The token source.
     * @param channel The channel to use for filtering tokens.
     */
    constructor(tokenSource: TokenSource, channel?: number);
    protected adjustSeekIndex(i: number): number;
    protected tryLB(k: number): Token | undefined;
    tryLT(k: number): Token | undefined;
    /** Count EOF just once. */
    getNumberOfOnChannelTokens(): number;
}
