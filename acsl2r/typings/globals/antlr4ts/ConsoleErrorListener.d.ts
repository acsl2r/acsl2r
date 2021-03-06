/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
/**
 *
 * @author Sam Harwell
 */
import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from './Recognizer';
export declare class ConsoleErrorListener implements ANTLRErrorListener<any> {
    /**
     * Provides a default instance of {@link ConsoleErrorListener}.
     */
    static readonly INSTANCE: ConsoleErrorListener;
    /**
     * {@inheritDoc}
     *
     * <p>
     * This implementation prints messages to {@link System#err} containing the
     * values of {@code line}, {@code charPositionInLine}, and {@code msg} using
     * the following format.</p>
     *
     * <pre>
     * line <em>line</em>:<em>charPositionInLine</em> <em>msg</em>
     * </pre>
     */
    syntaxError<T>(recognizer: Recognizer<T, any>, offendingSymbol: T, line: number, charPositionInLine: number, msg: string, e: RecognitionException): void;
}
