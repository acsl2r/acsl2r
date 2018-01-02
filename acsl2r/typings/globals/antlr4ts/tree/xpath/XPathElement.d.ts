/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ParseTree } from "../ParseTree";
export declare abstract class XPathElement {
    protected nodeName: string;
    invert: boolean;
    /** Construct element like {@code /ID} or {@code ID} or {@code /*} etc...
     *  op is null if just node
     */
    constructor(nodeName: string);
    /**
     * Given tree rooted at {@code t} return all nodes matched by this path
     * element.
     */
    abstract evaluate(t: ParseTree): ParseTree[];
    toString(): string;
}
