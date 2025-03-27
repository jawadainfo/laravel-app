/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const map = new WeakMap();
/**
 * Returns a map of the file's key correspondence to its DOM element in the file browser
 * @private
 */
export const elementsMap = (view) => {
    let result = map.get(view);
    if (!result) {
        result = {};
        map.set(view, result);
    }
    return result;
};
