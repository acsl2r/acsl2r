/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { CharStream } from '../../CharStream';
import { Token } from '../../Token';
import { TokenSource } from '../../TokenSource';
/**
 * A {@link Token} object representing an entire subtree matched by a parser
 * rule; e.g., {@code <expr>}. These tokens are created for {@link TagChunk}
 * chunks where the tag corresponds to a parser rule.
 */
export declare class RuleTagToken implements Token {
    /**
     * This is the backing field for `ruleName`.
     */
    private _ruleName;
    /**
     * The token type for the current token. This is the token type assigned to
     * the bypass alternative for the rule during ATN deserialization.
     */
    private bypassTokenType;
    /**
     * This is the backing field for `label`.
     */
    private _label?;
    /**
     * Constructs a new instance of {@link RuleTagToken} with the specified rule
     * name, bypass token type, and label.
     *
     * @param ruleName The name of the parser rule this rule tag matches.
     * @param bypassTokenType The bypass token type assigned to the parser rule.
     * @param label The label associated with the rule tag, or {@code null} if
     * the rule tag is unlabeled.
     *
     * @exception IllegalArgumentException if {@code ruleName} is {@code null}
     * or empty.
     */
    constructor(ruleName: string, bypassTokenType: number, label?: string);
    /**
     * Gets the name of the rule associated with this rule tag.
     *
     * @return The name of the parser rule associated with this rule tag.
     */
    readonly ruleName: string;
    /**
     * Gets the label associated with the rule tag.
     *
     * @return The name of the label associated with the rule tag, or
     * {@code null} if this is an unlabeled rule tag.
     */
    readonly label: string | undefined;
    /**
     * {@inheritDoc}
     *
     * <p>Rule tag tokens are always placed on the {@link #DEFAULT_CHANNEL}.</p>
     */
    readonly channel: number;
    /**
     * {@inheritDoc}
     *
     * <p>This method returns the rule tag formatted with {@code <} and {@code >}
     * delimiters.</p>
     */
    readonly text: string;
    /**
     * {@inheritDoc}
     *
     * <p>Rule tag tokens have types assigned according to the rule bypass
     * transitions created during ATN deserialization.</p>
     */
    readonly type: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns 0.</p>
     */
    readonly line: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     */
    readonly charPositionInLine: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     */
    readonly tokenIndex: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     */
    readonly startIndex: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     */
    readonly stopIndex: number;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
     */
    readonly tokenSource: TokenSource | undefined;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
     */
    readonly inputStream: CharStream | undefined;
    /**
     * {@inheritDoc}
     *
     * <p>The implementation for {@link RuleTagToken} returns a string of the form
     * {@code ruleName:bypassTokenType}.</p>
     */
    toString(): string;
}
