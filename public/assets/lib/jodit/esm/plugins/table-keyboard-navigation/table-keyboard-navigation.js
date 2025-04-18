/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import * as consts from "../../core/constants.js";
import { Dom } from "../../core/dom/dom.js";
import { pluginSystem } from "../../core/global.js";
import { call } from "../../core/helpers/index.js";
import { Table } from "../../modules/table/table.js";
const WORK_KEYS = new Set([
    consts.KEY_TAB,
    consts.KEY_LEFT,
    consts.KEY_RIGHT,
    consts.KEY_UP,
    consts.KEY_DOWN
]);
/**
 * Process navigates key pressing in table cell
 */
export function tableKeyboardNavigation(editor) {
    editor.e
        .off('.tableKeyboardNavigation')
        .on('keydown.tableKeyboardNavigation', (event) => {
        const { key } = event;
        const cell = findCell(editor, key);
        if (!cell) {
            return;
        }
        const tableModule = editor.getInstance(Table, editor.o);
        const table = Dom.closest(cell, 'table', editor.editor);
        let next = null;
        const isPrev = key === consts.KEY_LEFT || event.shiftKey;
        const getNextCell = () => call(isPrev ? Dom.prev : Dom.next, cell, Dom.isCell, table);
        switch (key) {
            case consts.KEY_TAB:
            case consts.KEY_LEFT: {
                next = getNextCell();
                if (!next) {
                    tableModule.appendRow(table, !isPrev
                        ? false
                        : table.querySelector('tr'), !isPrev);
                    next = getNextCell();
                }
                break;
            }
            case consts.KEY_UP:
            case consts.KEY_DOWN:
                {
                    const matrix = tableModule.formalMatrix(table);
                    const [row, column] = tableModule.formalCoordinate(table, cell);
                    if (key === consts.KEY_UP) {
                        if (matrix[row - 1] !== undefined) {
                            next = matrix[row - 1][column];
                        }
                    }
                    else {
                        if (matrix[row + 1] !== undefined) {
                            next = matrix[row + 1][column];
                        }
                    }
                }
                break;
        }
        if (!next) {
            return;
        }
        editor.e.fire('hidePopup hideResizer');
        if (!next.firstChild) {
            const first = editor.createInside.element('br');
            next.appendChild(first);
            editor.s.setCursorBefore(first);
        }
        else {
            if (key === consts.KEY_TAB) {
                editor.s.select(next, true);
            }
            else {
                editor.s.setCursorIn(next, key === consts.KEY_RIGHT || key === consts.KEY_DOWN);
            }
        }
        editor.synchronizeValues();
        return false;
    });
}
pluginSystem.add('tableKeyboardNavigation', tableKeyboardNavigation);
function findCell(editor, key) {
    if (!WORK_KEYS.has(key)) {
        return;
    }
    const current = editor.s.current();
    if (!current) {
        return;
    }
    const cell = Dom.up(current, Dom.isCell, editor.editor);
    if (!cell) {
        return;
    }
    const { range } = editor.s;
    if (key !== consts.KEY_TAB && current !== cell) {
        const isNextDirection = key === consts.KEY_RIGHT || key === consts.KEY_DOWN;
        const hasNext = call(!isNextDirection ? Dom.prev : Dom.next, current, elm => key === consts.KEY_UP || key === consts.KEY_DOWN
            ? Dom.isTag(elm, 'br')
            : Boolean(elm), cell);
        if ((!isNextDirection &&
            (hasNext ||
                (key !== consts.KEY_UP &&
                    Dom.isText(current) &&
                    range.startOffset !== 0))) ||
            (isNextDirection &&
                (hasNext ||
                    (key !== consts.KEY_DOWN &&
                        Dom.isText(current) &&
                        current.nodeValue &&
                        range.startOffset !== current.nodeValue.length)))) {
            return;
        }
    }
    return cell;
}
