/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * @module helpers/html
 */
import { globalDocument, IS_PROD } from "../../constants.js";
import { Dom } from "../../dom/dom.js";
import { trim } from "../string/trim.js";
import { $$ } from "../utils/selector.js";
function normalizeCSS(s) {
    return s
        .replace(/mso-[a-z-]+:[\s]*[^;]+;/gi, '')
        .replace(/mso-[a-z-]+:[\s]*[^";']+$/gi, '')
        .replace(/border[a-z-]*:[\s]*[^;]+;/gi, '')
        .replace(/([0-9.]+)(pt|cm)/gi, (match, units, metrics) => {
        switch (metrics.toLowerCase()) {
            case 'pt':
                return (parseFloat(units) * 1.328).toFixed(0) + 'px';
            case 'cm':
                return (parseFloat(units) * 0.02645833).toFixed(0) + 'px';
        }
        return match;
    });
}
/**
 * If the HTML has CSS rules with selectors,
 * it applies them to the selectors in the HTML itself
 * and then removes the selector styles, leaving only the inline ones.
 */
export function applyStyles(html) {
    if (html.indexOf('<html ') === -1) {
        return html;
    }
    html = html.substring(html.indexOf('<html '), html.length);
    html = html.substring(0, html.lastIndexOf('</html>') + '</html>'.length);
    const iframe = globalDocument.createElement('iframe');
    iframe.style.display = 'none';
    globalDocument.body.appendChild(iframe);
    let convertedString = '', collection = [];
    try {
        const iframeDoc = iframe.contentDocument ||
            (iframe.contentWindow ? iframe.contentWindow.document : null);
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            try {
                for (let i = 0; i < iframeDoc.styleSheets.length; i += 1) {
                    const rules = iframeDoc.styleSheets[i].cssRules;
                    for (let idx = 0; idx < rules.length; idx += 1) {
                        if (rules[idx].selectorText === '') {
                            continue;
                        }
                        collection = $$(rules[idx].selectorText, iframeDoc.body);
                        collection.forEach((elm) => {
                            elm.style.cssText = normalizeCSS(rules[idx].style.cssText +
                                ';' +
                                elm.style.cssText);
                        });
                    }
                }
            }
            catch (e) {
                if (!IS_PROD) {
                    throw e;
                }
            }
            Dom.each(iframeDoc.body, node => {
                if (Dom.isElement(node)) {
                    const elm = node;
                    const css = elm.getAttribute('style');
                    if (css) {
                        elm.style.cssText = normalizeCSS(css);
                    }
                    if (elm.hasAttribute('style') &&
                        !elm.getAttribute('style')) {
                        elm.removeAttribute('style');
                    }
                }
            });
            convertedString = iframeDoc.firstChild
                ? trim(iframeDoc.body.innerHTML)
                : '';
        }
    }
    catch (_a) {
    }
    finally {
        Dom.safeRemove(iframe);
    }
    if (convertedString) {
        html = convertedString;
    }
    return trim(html
        .replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
        .replace(/<!--[^>]*>/g, ''));
}
