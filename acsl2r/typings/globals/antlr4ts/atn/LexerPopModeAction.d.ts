/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Lexer } from '../Lexer';
import { LexerAction } from './LexerAction';
import { LexerActionType } from './LexerActionType';
/**
 * Implements the {@code popMode} lexer action by calling {@link Lexer#popMode}.
 *
 * <p>The {@code popMode} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link #INSTANCE}.</p>
 *
 * @author Sam Harwell
 * @since 4.2
 */
export declare class LexerPopModeAction implements LexerAction {
    /**
     * Constructs the singleton instance of the lexer {@code popMode} command.
     */
    constructor();
    /**
     * {@inheritDoc}
     * @return This method returns {@link LexerActionType#POP_MODE}.
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
     * <p>This action is implemented by calling {@link Lexer#popMode}.</p>
     */
    execute(lexer: Lexer): void;
    hashCode(): number;
    equals(obj: any): boolean;
    toString(): string;
}
export declare namespace LexerPopModeAction {
    /**
     * Provides a singleton instance of this parameterless lexer action.
     */
    const INSTANCE: LexerPopModeAction;
}
