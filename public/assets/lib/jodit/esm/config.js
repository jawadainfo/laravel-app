/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
/**
 * Editor options. These can be configured upon the creation of the editor.
 * ```javascript
 * const editor = Jodit.make('#editor', {
 * 	 toolbar: true,
 * 	 buttons: ['bold', 'italic', 'underline']
 * 	 // other options
 * 	 // ...
 * });
 * ```
 * @packageDocumentation
 * @module config
 */
import * as consts from "./core/constants.js";
import { globalDocument, globalWindow, INSERT_AS_HTML } from "./core/constants.js";
/**
 * Default Editor's Configuration
 */
class Config {
    constructor() {
        /**
         * Use cache for heavy methods
         */
        this.cache = true;
        /**
         * Timeout of all asynchronous methods
         */
        this.defaultTimeout = 100;
        this.namespace = '';
        /**
         * Editor loads completely without plugins. Useful when debugging your own plugin.
         */
        this.safeMode = false;
        /**
         * Editor's width
         *
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    width: '100%',
         * })
         * ```
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    width: 600, // equivalent for '600px'
         * })
         * ```
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    width: 'auto', // autosize
         * })
         * ```
         */
        this.width = 'auto';
        /**
         * Editor's height
         *
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    height: '100%',
         * })
         * ```
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    height: 600, // equivalent for '600px'
         * })
         * ```
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    height: 'auto', // default - autosize
         * })
         * ```
         */
        this.height = 'auto';
        /**
         * List of plugins that will be initialized in safe mode.
         *
         * ```js
         * Jodit.make('#editor', {
         * 	safeMode: true,
         * 	safePluginsList: ['about'],
         * 	extraPlugins: ['yourPluginDev']
         * });
         * ```
         */
        this.safePluginsList = [
            'about',
            'enter',
            'backspace',
            'size',
            'bold',
            'hotkeys'
        ];
        /**
         * Reserved for the paid version of the editor
         */
        this.license = '';
        /**
         * The name of the preset that will be used to initialize the editor.
         * The list of available presets can be found here Jodit.defaultOptions.presets
         * ```javascript
         * Jodit.make('.editor', {
         * 	preset: 'inline'
         * });
         * ```
         */
        this.preset = 'custom';
        this.presets = {
            inline: {
                inline: true,
                toolbar: false,
                toolbarInline: true,
                toolbarInlineForSelection: true,
                showXPathInStatusbar: false,
                showCharsCounter: false,
                showWordsCounter: false,
                showPlaceholder: false
            }
        };
        this.ownerDocument = globalDocument;
        /**
         * Allows you to specify the window in which the editor will be created. Default - window
         * This is necessary if you are creating the editor inside an iframe but the code is running in the parent window
         */
        this.ownerWindow = globalWindow;
        /**
         * Shadow root if Jodit was created in it
         *
         * ```html
         * <div id="editor"></div>
         * ```
         *
         * ```js
         * const app = document.getElementById('editor');
         * app.attachShadow({ mode: 'open' });
         * const root = app.shadowRoot;
         *
         * root.innerHTML = `
         * <link rel="stylesheet" href="./build/jodit.css"/>
         * <h1>Jodit example in Shadow DOM</h1>
         * <div id="edit"></div>
         * `;
         *
         * const editor = Jodit.make(root.getElementById('edit'), {
         * 	globalFullSize: false,
         * 	shadowRoot: root
         * });
         * editor.value = '<p>start</p>';
         * ```
         */
        this.shadowRoot = null;
        /**
         * z-index For editor
         */
        this.zIndex = 0;
        /**
         * Change the read-only state of the editor
         */
        this.readonly = false;
        /**
         * Change the disabled state of the editor
         */
        this.disabled = false;
        /**
         * In readOnly mode, some buttons can still be useful, for example, the button to view source code or print
         */
        this.activeButtonsInReadOnly = [
            'source',
            'fullsize',
            'print',
            'about',
            'dots',
            'selectall'
        ];
        /**
         * When the editor is in read-only mode, some commands can still be executed:
         * ```javascript
         * const editor = Jodit.make('.editor', {
         * 	 allowCommandsInReadOnly: ['selectall', 'preview', 'print']
         * 	 readonly: true
         * });
         * editor.execCommand('selectall');// will be selected all content
         * editor.execCommand('delete');// but content will not be deleted
         * ```
         */
        this.allowCommandsInReadOnly = ['selectall', 'preview', 'print'];
        /**
         * Size of icons in the toolbar (can be "small", "middle", "large")
         *
         * @example
         * ```javascript
         * const editor = Jodit.make(".dark_editor", {
         *      toolbarButtonSize: "small"
         * });
         * ```
         */
        this.toolbarButtonSize = 'middle';
        /**
         * Allow navigation in the toolbar of the editor by Tab key
         */
        this.allowTabNavigation = false;
        /**
         * Inline editing mode
         */
        this.inline = false;
        /**
         * Theme (can be "dark")
         * @example
         * ```javascript
         * const editor = Jodit.make(".dark_editor", {
         *      theme: "dark"
         * });
         * ```
         */
        this.theme = 'default';
        /**
         * if set true, then the current mode is saved in a cookie, and is restored after a reload of the page
         */
        this.saveModeInStorage = false;
        /**
         * Class name that can be appended to the editable area
         *
         * @see [[Config.iframeCSSLinks]]
         * @see [[Config.iframeStyle]]
         *
         * @example
         * ```javascript
         * Jodit.make('#editor', {
         *    editorClassName: 'some_my_class'
         * });
         * ```
         * ```html
         * <style>
         * .some_my_class p{
         *    line-height: 16px;
         * }
         * </style>
         * ```
         */
        this.editorClassName = false;
        /**
         * Class name that can be appended to the main editor container
         * @example
         * ```javascript
         * const jodit = Jodit.make('#editor', {
         *    className: 'some_my_class'
         * });
         *
         * console.log(jodit.container.classList.contains('some_my_class')); // true
         * ```
         * ```html
         * <style>
         * .some_my_class {
         *    max-width: 600px;
         *    margin: 0 auto;
         * }
         * </style>
         * ```
         */
        this.className = false;
        /**
         * The internal styles of the editable area. They are intended to change
         * not the appearance of the editor, but to change the appearance of the content.
         * @example
         * ```javascript
         * Jodit.make('#editor', {
         * 		style: {
         * 		 font: '12px Arial',
         * 		 color: '#0c0c0c'
         * 		}
         * });
         * ```
         */
        this.style = false;
        /**
         *
         * @example
         * ```javascript
         * Jodit.make('#editor', {
         * 		editorStyle: {
         * 		 font: '12px Arial',
         * 		 color: '#0c0c0c'
         * 		}
         * });
         * ```
         */
        this.containerStyle = false;
        /**
         * Dictionary of variable values in css, a complete list can be found here
         * https://github.com/xdan/jodit/blob/main/src/styles/variables.less#L25
         *
         * @example
         * ```js
         * const editor = Jodit.make('#editor', {
         *   styleValues: {
         *		'color-text': 'red',
         *		colorBorder: 'black',
         *		'color-panel': 'blue'
         *   }
         * });
         * ```
         */
        this.styleValues = {};
        /**
         * After all, changes in editors for textarea will call change trigger
         *
         * @example
         * ```javascript
         * const editor = Jodit.make('#editor');
         * document.getElementById('editor').addEventListener('change', function () {
         *      console.log(this.value);
         * })
         * ```
         */
        this.triggerChangeEvent = true;
        /**
         * The writing direction of the language which is used to create editor content. Allowed values are: ''
         * (an empty string) – Indicates that content direction will be the same as either the editor UI direction or
         * the page element direction. 'ltr' – Indicates a Left-To-Right text direction (like in English).
         * 'rtl' – Indicates a Right-To-Left text direction (like in Arabic).
         *
         * @example
         * ```javascript
         * Jodit.make('.editor', {
         *    direction: 'rtl'
         * })
         * ```
         */
        this.direction = '';
        /**
         * Language by default. if `auto` language set by document.documentElement.lang ||
         * (navigator.language && navigator.language.substr(0, 2)) ||
         * (navigator.browserLanguage && navigator.browserLanguage.substr(0, 2)) || 'en'
         *
         * @example
         * ```html
         * <!-- include in you page lang file -->
         * <script src="jodit/lang/de.js"></script>
         * <script>
         * var editor = Jodit.make('.editor', {
         *    language: 'de'
         * });
         * </script>
         * ```
         */
        this.language = 'auto';
        /**
         * if true all Lang.i18n(key) return `{key}`
         *
         * @example
         * ```html
         * <script>
         * var editor = Jodit.make('.editor', {
         *    debugLanguage: true
         * });
         *
         * console.log(editor.i18n("Test")); // {Test}
         * </script>
         * ```
         */
        this.debugLanguage = false;
        /**
         * Collection of language pack data `{en: {'Type something': 'Type something', ...}}`
         *
         * @example
         * ```javascript
         * const editor = Jodit.make('#editor', {
         *     language: 'ru',
         *     i18n: {
         *         ru: {
         *            'Type something': 'Начните что-либо вводить'
         *         }
         *     }
         * });
         * console.log(editor.i18n('Type something')) //Начните что-либо вводить
         * ```
         */
        this.i18n = false;
        /**
         * The tabindex global attribute is an integer indicating if the element can take
         * input focus (is focusable), if it should participate to sequential keyboard navigation,
         * and if so, at what position. It can take several values
         */
        this.tabIndex = -1;
        /**
         * Boolean, whether the toolbar should be shown.
         * Alternatively, a valid css-selector-string to use an element as toolbar container.
         */
        this.toolbar = true;
        /**
         * Boolean, whether the statusbar should be shown.
         */
        this.statusbar = true;
        /**
         * Show tooltip after mouse enter on the button
         */
        this.showTooltip = true;
        /**
         * Delay before show tooltip
         */
        this.showTooltipDelay = 200;
        /**
         * Instead of create custop tooltip - use native title tooltips
         */
        this.useNativeTooltip = false;
        /**
         * Default insert method
         * @default insert_as_html
         */
        this.defaultActionOnPaste = INSERT_AS_HTML;
        // TODO
        // autosave: false, // false or url
        // autosaveCallback: false, // function
        // interval: 60, // seconds
        // TODO
        /**
         * Element that will be created when you press Enter
         */
        this.enter = consts.PARAGRAPH;
        /**
         * When this option is enabled, the editor's content will be placed in an iframe and isolated from the rest of the page.
         *
         * @example
         * ```javascript
         * Jodit.make('#editor', {
         *    iframe: true,
         *    iframeStyle: 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index:2;\
         *    user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}';
         * });
         * ```
         */
        this.iframe = false;
        /**
         * Allow editing the entire HTML document(html, head)
         * \> Works together with the iframe option.
         * @example
         * ```js
         * const editor = Jodit.make('#editor', {
         *   iframe: true,
         *   editHTMLDocumentMode: true
         * });
         * editor.value = '<!DOCTYPE html><html lang="en" style="overflow-y:hidden">' +
         * 	'<head><title>Jodit Editor</title></head>' +
         * 	'<body spellcheck="false"><p>Some text</p><p> a </p></body>' +
         * 	'</html>';
         * ```
         */
        this.editHTMLDocumentMode = false;
        /**
         * Use when you need to insert new block element
         * use enter option if not set
         */
        this.enterBlock = this.enter !== 'br' ? this.enter : consts.PARAGRAPH;
        /**
         * Jodit.MODE_WYSIWYG The HTML editor allows you to write like MSWord,
         * Jodit.MODE_SOURCE syntax highlighting source editor
         * @example
         * ```javascript
         * var editor = Jodit.make('#editor', {
         *     defaultMode: Jodit.MODE_SPLIT
         * });
         * console.log(editor.getRealMode())
         * ```
         */
        this.defaultMode = consts.MODE_WYSIWYG;
        /**
         * Use split mode
         */
        this.useSplitMode = false;
        /**
         * The colors in HEX representation to select a color for the background and for the text in colorpicker
         * @example
         * ```javascript
         *  Jodit.make('#editor', {
         *     colors: ['#ff0000', '#00ff00', '#0000ff']
         * })
         * ```
         */
        this.colors = {
            greyscale: [
                '#000000',
                '#434343',
                '#666666',
                '#999999',
                '#B7B7B7',
                '#CCCCCC',
                '#D9D9D9',
                '#EFEFEF',
                '#F3F3F3',
                '#FFFFFF'
            ],
            palette: [
                '#980000',
                '#FF0000',
                '#FF9900',
                '#FFFF00',
                '#00F0F0',
                '#00FFFF',
                '#4A86E8',
                '#0000FF',
                '#9900FF',
                '#FF00FF'
            ],
            full: [
                '#E6B8AF',
                '#F4CCCC',
                '#FCE5CD',
                '#FFF2CC',
                '#D9EAD3',
                '#D0E0E3',
                '#C9DAF8',
                '#CFE2F3',
                '#D9D2E9',
                '#EAD1DC',
                '#DD7E6B',
                '#EA9999',
                '#F9CB9C',
                '#FFE599',
                '#B6D7A8',
                '#A2C4C9',
                '#A4C2F4',
                '#9FC5E8',
                '#B4A7D6',
                '#D5A6BD',
                '#CC4125',
                '#E06666',
                '#F6B26B',
                '#FFD966',
                '#93C47D',
                '#76A5AF',
                '#6D9EEB',
                '#6FA8DC',
                '#8E7CC3',
                '#C27BA0',
                '#A61C00',
                '#CC0000',
                '#E69138',
                '#F1C232',
                '#6AA84F',
                '#45818E',
                '#3C78D8',
                '#3D85C6',
                '#674EA7',
                '#A64D79',
                '#85200C',
                '#990000',
                '#B45F06',
                '#BF9000',
                '#38761D',
                '#134F5C',
                '#1155CC',
                '#0B5394',
                '#351C75',
                '#733554',
                '#5B0F00',
                '#660000',
                '#783F04',
                '#7F6000',
                '#274E13',
                '#0C343D',
                '#1C4587',
                '#073763',
                '#20124D',
                '#4C1130'
            ]
        };
        /**
         * The default tab color picker
         * @example
         * ```javascript
         * Jodit.make('#editor2', {
         *     colorPickerDefaultTab: 'color'
         * })
         * ```
         */
        this.colorPickerDefaultTab = 'background';
        /**
         * Image size defaults to a larger image
         */
        this.imageDefaultWidth = 300;
        /**
         * Do not display these buttons that are on the list
         * @example
         * ```javascript
         * Jodit.make('#editor2', {
         *     removeButtons: ['hr', 'source']
         * });
         * ```
         */
        this.removeButtons = [];
        /**
         * Do not init these plugins
         * @example
         * ```typescript
         * var editor = Jodit.make('.editor', {
         *    disablePlugins: 'table,iframe'
         * });
         * //or
         * var editor = Jodit.make('.editor', {
         *    disablePlugins: ['table', 'iframe']
         * });
         * ```
         */
        this.disablePlugins = [];
        /**
         * Init and download extra plugins
         * @example
         * ```typescript
         * var editor = Jodit.make('.editor', {
         *    extraPlugins: ['emoji']
         * });
         * ```
         * It will try load %SCRIPT_PATH%/plugins/emoji/emoji.js and after load will try init it
         */
        this.extraPlugins = [];
        /**
         * These buttons list will be added to the option. Buttons
         */
        this.extraButtons = [];
        /**
         * By default, you can only install an icon from the Jodit suite.
         * You can add your icon to the set using the `Jodit.modules.Icon.set (name, svg Code)` method.
         * But for a declarative declaration, you can use this option.
         *
         * @example
         * ```js
         * Jodit.modules.Icon.set('someIcon', '<svg><path.../></svg>');
         * const editor = Jodit.make({
         *   extraButtons: [{
         *     name: 'someButton',
         *     icon: 'someIcon'
         *   }]
         * });
         *
         * @example
         * const editor = Jodit.make({
         *   extraIcons: {
         *     someIcon: '<svg><path.../></svg>'
         *   },
         *   extraButtons: [{
         *     name: 'someButton',
         *     icon: 'someIcon'
         *   }]
         * });
         * ```
         * @example
         * ```js
         * const editor = Jodit.make({
         *   extraButtons: [{
         *     name: 'someButton',
         *     icon: '<svg><path.../></svg>'
         *   }]
         * });
         * ```
         */
        this.extraIcons = {};
        /**
         * Default attributes for created inside editor elements
         * @example
         * ```js
         * const editor2 = Jodit.make('#editor', {
         * 	createAttributes: {
         * 		div: {
         * 			class: 'test'
         * 		},
         * 		ul: function (ul) {
         * 			ul.classList.add('ui-test');
         * 		}
         * 	}
         * });
         *
         * const div2 = editor2.createInside.div();
         * expect(div2.className).equals('test');
         *
         * const ul = editor2.createInside.element('ul');
         * expect(ul.className).equals('ui-test');
         * ```
         * Or JSX in React
         * @example
         * ```jsx
         * import React, {useState, useRef} from 'react';
         * import JoditEditor from "jodit-react";
         *
         * const config = {
         * 	createAttributes: {
         * 		div: {
         * 			class: 'align-center'
         * 		}
         * 	}
         * };
         *
         * <JoditEditor config={config}/>
         * ```
         */
        this.createAttributes = {
            table: {
                style: 'border-collapse:collapse;width: 100%;'
            }
        };
        /**
         * The width of the editor, accepted as the biggest. Used to the responsive version of the editor
         */
        this.sizeLG = 900;
        /**
         * The width of the editor, accepted as the medium. Used to the responsive version of the editor
         */
        this.sizeMD = 700;
        /**
         * The width of the editor, accepted as the small. Used to the responsive version of the editor
         */
        this.sizeSM = 400;
        /**
         * The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG).
         * Note - this is not the width of the device, the width of the editor
         * @example
         * ```javascript
         * Jodit.make('#editor', {
         *     buttons: ['bold', 'italic', 'source'],
         *     buttonsMD: ['bold', 'italic'],
         *     buttonsXS: ['bold', 'fullsize'],
         * });
         * ```
         * @example
         * ```javascript
         * Jodit.make('#editor2', {
         *     buttons: [{
         *         name: 'empty',
         *         icon: 'source',
         *         exec: function (editor) {
         *             const dialog = new Jodit.modules.Dialog({}),
         *                 text = editor.c.element('textarea');
         *
         *             dialog.setHeader('Source code');
         *             dialog.setContent(text);
         *             dialog.setSize(400, 300);
         *
         *             Jodit.modules.Helpers.css(elm, {
         *                 width: '100%',
         *                 height: '100%'
         *             })
    
         *             dialog.open();
         *         }
         *     }]
         * });
         * ```
         * @example
         * ```javascript
         * Jodit.make('#editor2', {
         *     buttons: Jodit.defaultOptions.buttons.concat([{
         *        name: 'listsss',
         *        iconURL: 'stuf/dummy.png',
         *        list: {
         *            h1: 'insert Header 1',
         *            h2: 'insert Header 2',
         *            clear: 'Empty editor',
         *        },
         *        exec: ({originalEvent, control, btn}) => {
         *             var key = control.args[0],
         *                value = control.args[1];
         *             if (key === 'clear') {
         *                 this.val('');
         *                 return;
         *             }
         *             this.s.insertNode(this.c.element(key, ''));
         *             this.message.info('Was inserted ' + value);
         *        },
         *        template: function (key, value) {
         *            return '<div>' + value + '</div>';
         *        }
         *  });
         * ```
         */
        this.buttons = [
            {
                group: 'font-style',
                buttons: []
            },
            {
                group: 'list',
                buttons: []
            },
            {
                group: 'font',
                buttons: []
            },
            '---',
            {
                group: 'script',
                buttons: []
            },
            {
                group: 'media',
                buttons: []
            },
            '\n',
            {
                group: 'state',
                buttons: []
            },
            {
                group: 'clipboard',
                buttons: []
            },
            {
                group: 'insert',
                buttons: []
            },
            {
                group: 'indent',
                buttons: []
            },
            {
                group: 'color',
                buttons: []
            },
            {
                group: 'form',
                buttons: []
            },
            '---',
            {
                group: 'history',
                buttons: []
            },
            {
                group: 'search',
                buttons: []
            },
            {
                group: 'source',
                buttons: []
            },
            {
                group: 'other',
                buttons: []
            },
            {
                group: 'info',
                buttons: []
            }
        ];
        /**
         * Some events are called when the editor is initialized, for example, the `afterInit` event.
         * So this code won't work:
         * ```javascript
         * const editor = Jodit.make('#editor');
         * editor.events.on('afterInit', () => console.log('afterInit'));
         * ```
         * You need to do this:
         * ```javascript
         * Jodit.make('#editor', {
         * 		events: {
         * 	  	afterInit: () => console.log('afterInit')
         * 		}
         * });
         * ```
         * The option can use any Jodit events, for example:
         * ```javascript
         * const editor = Jodit.make('#editor', {
         * 		events: {
         * 			hello: (name) => console.log('Hello', name)
         * 		}
         * });
         * editor.e.fire('hello', 'Mike');
         * ```
         */
        this.events = {};
        /**
         * Buttons in toolbat without SVG - only texts
         */
        this.textIcons = false;
        /**
         * Element for dialog container
         */
        this.popupRoot = null;
        /**
         * shows a INPUT[type=color] to open the browser color picker, on the right bottom of widget color picker
         */
        this.showBrowserColorPicker = true;
    }
    static get defaultOptions() {
        if (!Config.__defaultOptions) {
            Config.__defaultOptions = new Config();
        }
        return Config.__defaultOptions;
    }
}
Config.prototype.controls = {};
export { Config };
