/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Parser } from './Parser';
import { Recognizer } from './Recognizer';
import { RuleNode } from "./tree/RuleNode";
import { ParseTree } from "./tree/ParseTree";
import { Interval } from "./misc/Interval";
import { ParseTreeVisitor } from "./tree/ParseTreeVisitor";
export declare class RuleContext extends RuleNode {
    _parent: RuleContext | undefined;
    invokingState: number;
    constructor();
    constructor(parent: RuleContext | undefined, invokingState: number);
    static getChildContext(parent: RuleContext, invokingState: number): RuleContext;
    depth(): number;
    /** A context is empty if there is no invoking state; meaning nobody called
     *  current context.
     */
    readonly isEmpty: boolean;
    readonly sourceInterval: Interval;
    readonly ruleContext: RuleContext;
    readonly parent: RuleContext | undefined;
    readonly payload: RuleContext;
    /** Return the combined text of all child nodes. This method only considers
     *  tokens which have been added to the parse tree.
     *  <p>
     *  Since tokens on hidden channels (e.g. whitespace or comments) are not
     *  added to the parse trees, they will not appear in the output of this
     *  method.
     */
    readonly text: string;
    readonly ruleIndex: number;
    /** For rule associated with this parse tree internal node, return
     *  the outer alternative number used to match the input. Default
     *  implementation does not compute nor store this alt num. Create
     *  a subclass of ParserRuleContext with backing field and set
     *  option contextSuperClass.
     *  to set it.
     *
     *  @since 4.5.3
     */
    /** Set the outer alternative number for this context node. Default
     *  implementation does nothing to avoid backing field overhead for
     *  trees that don't need it.  Create
     *  a subclass of ParserRuleContext with backing field and set
     *  option contextSuperClass.
     *
     *  @since 4.5.3
     */
    altNumber: number;
    getChild(i: number): ParseTree;
    readonly childCount: number;
    accept<T>(visitor: ParseTreeVisitor<T>): T;
    /** Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     *  We have to know the recognizer so we can get rule names.
     */
    toStringTree(recog: Parser): string;
    /** Print out a whole tree, not just a node, in LISP format
     *  (root child1 .. childN). Print just a node if this is a leaf.
     */
    toStringTree(ruleNames: string[] | undefined): string;
    toStringTree(): string;
    toString(): string;
    toString(recog: Recognizer<any, any> | undefined): string;
    toString(ruleNames: string[] | undefined): string;
    toString(recog: Recognizer<any, any> | undefined, stop: RuleContext | undefined): string;
    toString(ruleNames: string[] | undefined, stop: RuleContext | undefined): string;
}
