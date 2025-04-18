/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module plugins/delete
 */
declare module 'jodit/types/jodit' {
    interface IJodit {
        /**
         * Delete plugin: Remove selected text
         */
        execCommand(command: 'delete'): void;
    }
}
