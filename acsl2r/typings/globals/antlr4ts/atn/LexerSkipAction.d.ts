/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Lexer } from '../Lexer';
import { LexerAction } from './LexerAction';
import { LexerActionType } from './LexerActionType';
/**
 * Implements the {@code skip} lexer action by calling {@link Lexer#skip}.
 *
 * <p>The {@code skip} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link #INSTANCE}.</p>
 *
 * @author Sam Harwell
 * @since 4.2
 */
export declare class LexerSkipAction implements LexerAction {
    /**
     * Constructs the singleton instance of the lexer {@code skip} command.
     */
    constructor();
    /**
     * {@inheritDoc}
     * @return This method returns {@link LexerActionType#SKIP}.
     */
    readonly actionType: LexerActionType;
    /**
     * {@inheritDoc}
     * @return This method returns {@code false}.
     */
    readonly isPositionDependent: boolean;
    /**
     * {@inheritDoc}
     *
     * <p>This action is implemented by calling {@link Lexer#skip}.</p>
     */
    execute(lexer: Lexer): void;
    hashCode(): number;
    equals(obj: any): boolean;
    toString(): string;
}
export declare namespace LexerSkipAction {
    /**
     * Provides a singleton instance of this parameterless lexer action.
     */
    const INSTANCE: LexerSkipAction;
}
