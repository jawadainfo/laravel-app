/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { cache, cached } from "../../core/decorators/cache/cache.js";
import { watch } from "../../core/decorators/watch/watch.js";
import { extendLang, pluginSystem } from "../../core/global.js";
import { isAbortError } from "../../core/helpers/checker/is-abort-error.js";
import { Plugin } from "../../core/plugin/plugin.js";
import "./config.js";
import { UiAiAssistant } from "./ui/ui-ai-assistant.js";
import * as lang from "./langs/index.js";
/**
 * The plugin inserts content generated by AI into the editor.
 */
export class aiAssistant extends Plugin {
    get __dialog() {
        return this.jodit.dlg({
            buttons: ['fullsize', 'dialog.close'],
            closeOnClickOverlay: true,
            closeOnEsc: true,
            resizable: false,
            draggable: true,
            minHeight: 160
        });
    }
    get __container() {
        const { jodit, __dialog } = this;
        return new UiAiAssistant(jodit, {
            onInsertAfter(html) {
                jodit.s.focus();
                jodit.s.setCursorAfter(jodit.s.current());
                jodit.s.insertHTML(html);
                __dialog.close();
            },
            onInsert(html) {
                jodit.s.focus();
                jodit.s.insertHTML(html);
                __dialog.close();
            }
        });
    }
    constructor(jodit) {
        super(jodit);
        /** @override */
        this.buttons = [
            {
                name: 'ai-commands',
                group: 'insert'
            },
            {
                name: 'ai-assistant',
                group: 'insert'
            }
        ];
        extendLang(lang);
    }
    /** @override */
    afterInit() { }
    onGenerateAiAssistantForm(prompt) {
        this.__dialog.open(this.__container, 'AI Assistant');
        this.__container.setPrompt(prompt);
    }
    onInvokeAiAssistant(prompt) {
        const { jodit } = this;
        jodit.s.focus();
        const selectedText = jodit.s.html;
        jodit.async
            .promise(async (resolve, reject) => {
            try {
                const result = await jodit.o.aiAssistant
                    .aiAssistantCallback(prompt, selectedText);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        })
            .then((htmlFragment) => {
            jodit.e.fire('ai-assistant-response', htmlFragment);
        })
            .catch(error => {
            if (isAbortError(error)) {
                return;
            }
            jodit.message.error(error.message);
            jodit.e.fire('ai-assistant-error', error.message);
        });
    }
    /** @override */
    beforeDestruct(_) {
        var _a, _b;
        (_a = cached(this, '__container')) === null || _a === void 0 ? void 0 : _a.destruct();
        (_b = cached(this, '__dialog')) === null || _b === void 0 ? void 0 : _b.destruct();
    }
}
__decorate([
    cache
], aiAssistant.prototype, "__dialog", null);
__decorate([
    cache
], aiAssistant.prototype, "__container", null);
__decorate([
    watch(':generateAiAssistantForm.ai-assistant')
], aiAssistant.prototype, "onGenerateAiAssistantForm", null);
__decorate([
    watch(':invokeAiAssistant')
], aiAssistant.prototype, "onInvokeAiAssistant", null);
pluginSystem.add('ai-assistant', aiAssistant);
