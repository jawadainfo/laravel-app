/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module plugins/clean-html
 */
import type { IDictionary, IJodit, Nullable } from "../../../../../types/index";
/**
 * @private
 */
export declare function tryRemoveNode(jodit: IJodit, nodeElm: Node, hadEffect: boolean, allowTags: IDictionary | false, denyTags: IDictionary | false, currentSelectionNode: Nullable<Node>): boolean;
