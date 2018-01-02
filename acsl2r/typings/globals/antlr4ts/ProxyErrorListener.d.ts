/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ANTLRErrorListener } from './ANTLRErrorListener';
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
/**
 * This implementation of {@link ANTLRErrorListener} dispatches all calls to a
 * collection of delegate listeners. This reduces the effort required to support multiple
 * listeners.
 *
 * @author Sam Harwell
 */
export declare class ProxyErrorListener<Symbol> implements ANTLRErrorListener<Symbol> {
    private delegates;
    constructor(delegates: ANTLRErrorListener<Symbol>[]);
    protected getDelegates(): ANTLRErrorListener<Symbol>[];
    syntaxError<T extends Symbol>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void;
}
