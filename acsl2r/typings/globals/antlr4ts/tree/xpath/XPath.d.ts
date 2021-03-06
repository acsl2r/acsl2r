/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Parser } from "../../Parser";
import { ParseTree } from "../ParseTree";
import { Token } from "../../Token";
import { XPathElement } from "./XPathElement";
/**
 * Represent a subset of XPath XML path syntax for use in identifying nodes in
 * parse trees.
 *
 * <p>
 * Split path into words and separators {@code /} and {@code //} via ANTLR
 * itself then walk path elements from left to right. At each separator-word
 * pair, find set of nodes. Next stage uses those as work list.</p>
 *
 * <p>
 * The basic interface is
 * {@link XPath#findAll ParseTree.findAll}{@code (tree, pathString, parser)}.
 * But that is just shorthand for:</p>
 *
 * <pre>
 * {@link XPath} p = new {@link XPath#XPath XPath}(parser, pathString);
 * return p.{@link #evaluate evaluate}(tree);
 * </pre>
 *
 * <p>
 * See {@code org.antlr.v4.test.TestXPath} for descriptions. In short, this
 * allows operators:</p>
 *
 * <dl>
 * <dt>/</dt> <dd>root</dd>
 * <dt>//</dt> <dd>anywhere</dd>
 * <dt>!</dt> <dd>invert; this must appear directly after root or anywhere
 * operator</dd>
 * </dl>
 *
 * <p>
 * and path elements:</p>
 *
 * <dl>
 * <dt>ID</dt> <dd>token name</dd>
 * <dt>'string'</dt> <dd>any string literal token from the grammar</dd>
 * <dt>expr</dt> <dd>rule name</dd>
 * <dt>*</dt> <dd>wildcard matching any node</dd>
 * </dl>
 *
 * <p>
 * Whitespace is not allowed.</p>
 */
export declare class XPath {
    static readonly WILDCARD: string;
    static readonly NOT: string;
    protected path: string;
    protected elements: XPathElement[];
    protected parser: Parser;
    constructor(parser: Parser, path: string);
    split(path: string): XPathElement[];
    /**
     * Convert word like {@code *} or {@code ID} or {@code expr} to a path
     * element. {@code anywhere} is {@code true} if {@code //} precedes the
     * word.
     */
    protected getXPathElement(wordToken: Token, anywhere: boolean): XPathElement;
    static findAll(tree: ParseTree, xpath: string, parser: Parser): ParseTree[];
    /**
     * Return a list of all nodes starting at {@code t} as root that satisfy the
     * path. The root {@code /} is relative to the node passed to
     * {@link #evaluate}.
     */
    evaluate(t: ParseTree): ParseTree[];
}
