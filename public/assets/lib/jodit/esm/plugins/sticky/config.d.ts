/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
declare module 'jodit/config' {
    interface Config {
        /**
         * @example
         * ```javascript
         * var editor = Jodit.make('#someid', {
         *  toolbarSticky: false
         * })
         * ```
         */
        toolbarSticky: boolean;
        toolbarDisableStickyForMobile: boolean;
        /**
         * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to
         * move the toolbar Jodit by this amount [more](https://xdsoft.net/jodit/docs/#2.5.57)
         *
         * @example
         * ```javascript
         * var editor = Jodit.make('#someid', {
         *  toolbarStickyOffset: 100
         * })
         * ```
         */
        toolbarStickyOffset: number;
    }
}
export {};
