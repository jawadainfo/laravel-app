/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
declare module 'jodit/config' {
    interface Config {
        tab: {
            /**
             * Pressing Tab inside LI will add an internal list
             */
            tabInsideLiInsertNewList: boolean;
        };
    }
}
export {};
