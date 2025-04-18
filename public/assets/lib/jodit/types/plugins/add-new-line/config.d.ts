/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module plugins/add-new-line
 */
import type { HTMLTagNames } from "../../types/index";
declare module 'jodit/config' {
    interface Config {
        /**
         * Create helper
         */
        addNewLine: boolean;
        /**
         * What kind of tags it will be impact
         */
        addNewLineTagsTriggers: HTMLTagNames[];
        /**
         * On dbl click on empty space of editor it add new P element
         * @example
         * ```js
         * Jodit.make('#editor', {
         *   addNewLineOnDBLClick: false // disable
         * })
         * ```
         */
        addNewLineOnDBLClick: boolean;
        /**
         * Absolute delta between cursor position and edge(top or bottom)
         * of element when show line
         */
        addNewLineDeltaShow: number;
    }
}
