/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Dom } from "../../../dom/dom.js";
import { isNormalNode } from "./is-normal-node.js";
import { isSuitElement } from "./is-suit-element.js";
/**
 * Checks if child elements are suitable for applying styles.
 * An element is suitable for us only if it is the only significant child.
 * If the child matches then returns it.
 * @example
 * `<font><strong>selected</strong></font>`
 * @private
 */
export function getSuitChild(style, font) {
    let { firstChild: child } = font;
    while (child && !isNormalNode(child)) {
        child = child.nextSibling;
        if (!child) {
            return null;
        }
    }
    if (child &&
        !Dom.next(child, isNormalNode, font) &&
        isSuitElement(style, child, false)) {
        return child;
    }
    return null;
}
