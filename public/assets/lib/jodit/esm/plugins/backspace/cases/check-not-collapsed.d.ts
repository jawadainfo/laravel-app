/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module plugins/backspace
 */
import type { IJodit } from "../../../types/index";
/**
 * On Not collapsed selection - should only remove whole selected content
 *
 * @example
 * ```html
 * <p>first | stop</p><p>second | stop</p>
 * ```
 * result
 * ```html
 * <p>first | stop</p>
 * ```
 * @private
 */
export declare function checkNotCollapsed(jodit: IJodit): boolean;
