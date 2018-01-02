/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Lexer } from '../Lexer';
import { LexerAction } from './LexerAction';
import { LexerActionType } from './LexerActionType';
/**
 * Implements the {@code pushMode} lexer action by calling
 * {@link Lexer#pushMode} with the assigned mode.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export declare class LexerPushModeAction implements LexerAction {
    private readonly _mode;
    /**
     * Constructs a new {@code pushMode} action with the specified mode value.
     * @param mode The mode value to pass to {@link Lexer#pushMode}.
     */
    constructor(mode: number);
    /**
     * Get the lexer mode this action should transition the lexer to.
     *
     * @return The lexer mode for this {@code pushMode} command.
     */
    readonly mode: number;
    /**
     * {@inheritDoc}
     * @return This method returns {@link LexerActionType#PUSH_MODE}.
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
     * <p>This action is implemented by calling {@link Lexer#pushMode} with the
     * value provided by {@link #getMode}.</p>
     */
    execute(lexer: Lexer): void;
    hashCode(): number;
    equals(obj: any): boolean;
    toString(): string;
}
