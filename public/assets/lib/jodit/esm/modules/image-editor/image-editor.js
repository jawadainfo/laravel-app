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
var ImageEditor_1;
import { ViewComponent } from "../../core/component/index.js";
import { autobind, component, debounce, throttle } from "../../core/decorators/index.js";
import { Dom } from "../../core/dom/index.js";
import { $$, attr, call, css, refs, toArray, trim } from "../../core/helpers/index.js";
import { Button } from "../../core/ui/button/index.js";
import { Config } from "../../config.js";
import "./config.js";
import { form } from "./templates/form.js";
const jie = 'jodit-image-editor';
const TABS = {
    resize: 'resize',
    crop: 'crop'
};
/**
 * The module allows you to edit the image: resize or cut any part of it
 *
 */
let ImageEditor = ImageEditor_1 = class ImageEditor extends ViewComponent {
    /** @override */
    className() {
        return 'ImageEditor';
    }
    get o() {
        return this.options;
    }
    /**
     * Hide image editor
     */
    hide() {
        this._dialog.close();
    }
    /**
     * Open image editor
     * @example
     * ```javascript
     * const jodit = Jodit.make('.editor', {
     *		 imageeditor: {
     *				 crop: false,
     *				 closeAfterSave: true,
     *				 width: 500
     *		 }
     * });
     * jodit.imageeditor.open('https://xdsoft.net/jodit/images/test.png', function (name, data, success, failed) {
     *		 var img = jodit.node.c('img');
     *		 img.setAttribute('src', 'https://xdsoft.net/jodit/images/test.png');
     *		 if (box.action !== 'resize') {
     *					return failed('Sorry it is work only in resize mode. For croping use FileBrowser');
     *		 }
     *		 img.style.width = data.w;
     *		 img.style.height = data.h;
     *		 jodit.s.insertNode(img);
     *		 success();
     * });
     * ```
     */
    open(url, save) {
        return this.j.async.promise((resolve) => {
            const timestamp = new Date().getTime();
            this.image = this.j.c.element('img');
            $$('img,.jodit-icon_loader', this.resize_box).forEach(Dom.safeRemove);
            $$('img,.jodit-icon_loader', this.crop_box).forEach(Dom.safeRemove);
            css(this.cropHandler, 'background', 'transparent');
            this.onSave = save;
            this.resize_box.appendChild(this.j.c.element('i', { class: 'jodit-icon_loader' }));
            this.crop_box.appendChild(this.j.c.element('i', { class: 'jodit-icon_loader' }));
            if (/\?/.test(url)) {
                url += '&_tst=' + timestamp;
            }
            else {
                url += '?_tst=' + timestamp;
            }
            this.image.setAttribute('src', url);
            this._dialog.open();
            const { widthInput, heightInput } = refs(this.editor);
            const onload = () => {
                if (this.isDestructed) {
                    return;
                }
                this.image.removeEventListener('load', onload);
                this.naturalWidth = this.image.naturalWidth;
                this.naturalHeight = this.image.naturalHeight;
                widthInput.value = this.naturalWidth.toString();
                heightInput.value = this.naturalHeight.toString();
                this.ratio = this.naturalWidth / this.naturalHeight;
                this.resize_box.appendChild(this.image);
                this.cropImage = this.image.cloneNode(true);
                this.crop_box.appendChild(this.cropImage);
                Dom.safeRemove.apply(null, $$('.jodit-icon_loader', this.editor));
                if (this.activeTab === TABS.crop) {
                    this.showCrop();
                }
                this.j.e.fire(this.resizeHandler, 'updatesize');
                this.j.e.fire(this.cropHandler, 'updatesize');
                this._dialog.setPosition();
                this.j.e.fire('afterImageEditor');
                resolve(this._dialog);
            };
            this.image.addEventListener('load', onload);
            if (this.image.complete) {
                onload();
            }
        });
    }
    onTitleModeClick(e) {
        const self = this, title = e.target;
        const slide = title === null || title === void 0 ? void 0 : title.parentElement;
        if (!slide) {
            return;
        }
        $$(`.${jie}__slider,.${jie}__area`, self.editor).forEach(elm => elm.classList.remove(`${jie}_active`));
        slide.classList.add(`${jie}_active`);
        this.activeTab = attr(slide, '-area') || TABS.resize;
        const tab = self.editor.querySelector(`.${jie}__area.${jie}__area_` + self.activeTab);
        if (tab) {
            tab.classList.add(`${jie}_active`);
        }
        if (self.activeTab === TABS.crop) {
            self.showCrop();
        }
    }
    onChangeSizeInput(e) {
        const self = this, input = e.target, { widthInput, heightInput } = refs(this.editor), isWidth = attr(input, 'data-ref') === 'widthInput', x = parseInt(input.value, 10), minX = isWidth ? self.o.min_width : self.o.min_height, minY = !isWidth ? self.o.min_width : self.o.min_height;
        let y;
        if (x > minX) {
            css(self.image, isWidth ? 'width' : 'height', x);
            if (self.resizeUseRatio) {
                y = isWidth
                    ? Math.round(x / self.ratio)
                    : Math.round(x * self.ratio);
                if (y > minY) {
                    css(self.image, !isWidth ? 'width' : 'height', y);
                    if (isWidth) {
                        heightInput.value = y.toString();
                    }
                    else {
                        widthInput.value = y.toString();
                    }
                }
            }
        }
        this.j.e.fire(self.resizeHandler, 'updatesize');
    }
    onResizeHandleMouseDown(e) {
        const self = this;
        self.target = e.target;
        e.preventDefault();
        e.stopImmediatePropagation();
        self.clicked = true;
        self.start_x = e.clientX;
        self.start_y = e.clientY;
        if (self.activeTab === TABS.crop) {
            self.top_x = css(self.cropHandler, 'left');
            self.top_y = css(self.cropHandler, 'top');
            self.width = self.cropHandler.offsetWidth;
            self.height = self.cropHandler.offsetHeight;
        }
        else {
            self.width = self.image.offsetWidth;
            self.height = self.image.offsetHeight;
        }
        self.j.e
            .on(this.j.ow, 'mousemove', this.onGlobalMouseMove)
            .one(this.j.ow, 'mouseup', this.onGlobalMouseUp);
    }
    onGlobalMouseUp(e) {
        if (this.clicked) {
            this.clicked = false;
            e.stopImmediatePropagation();
            this.j.e.off(this.j.ow, 'mousemove', this.onGlobalMouseMove);
        }
    }
    onGlobalMouseMove(e) {
        const self = this;
        if (!self.clicked) {
            return;
        }
        const { widthInput, heightInput } = refs(this.editor);
        self.diff_x = e.clientX - self.start_x;
        self.diff_y = e.clientY - self.start_y;
        if ((self.activeTab === TABS.resize && self.resizeUseRatio) ||
            (self.activeTab === TABS.crop && self.cropUseRatio)) {
            if (self.diff_x) {
                self.new_w = self.width + self.diff_x;
                self.new_h = Math.round(self.new_w / self.ratio);
            }
            else {
                self.new_h = self.height + self.diff_y;
                self.new_w = Math.round(self.new_h * self.ratio);
            }
        }
        else {
            self.new_w = self.width + self.diff_x;
            self.new_h = self.height + self.diff_y;
        }
        if (self.activeTab === TABS.resize) {
            if (self.new_w > self.o.resizeMinWidth) {
                css(self.image, 'width', self.new_w + 'px');
                widthInput.value = self.new_w.toString();
            }
            if (self.new_h > self.o.resizeMinHeight) {
                css(self.image, 'height', self.new_h + 'px');
                heightInput.value = self.new_h.toString();
            }
            this.j.e.fire(self.resizeHandler, 'updatesize');
        }
        else {
            if (self.target !== self.cropHandler) {
                if (self.top_x + self.new_w > self.cropImage.offsetWidth) {
                    self.new_w = self.cropImage.offsetWidth - self.top_x;
                }
                if (self.top_y + self.new_h > self.cropImage.offsetHeight) {
                    self.new_h = self.cropImage.offsetHeight - self.top_y;
                }
                css(self.cropHandler, {
                    width: self.new_w,
                    height: self.new_h
                });
            }
            else {
                if (self.top_x + self.diff_x + self.cropHandler.offsetWidth >
                    self.cropImage.offsetWidth) {
                    self.diff_x =
                        self.cropImage.offsetWidth -
                            self.top_x -
                            self.cropHandler.offsetWidth;
                }
                css(self.cropHandler, 'left', self.top_x + self.diff_x);
                if (self.top_y + self.diff_y + self.cropHandler.offsetHeight >
                    self.cropImage.offsetHeight) {
                    self.diff_y =
                        self.cropImage.offsetHeight -
                            self.top_y -
                            self.cropHandler.offsetHeight;
                }
                css(self.cropHandler, 'top', self.top_y + self.diff_y);
            }
            this.j.e.fire(self.cropHandler, 'updatesize');
        }
    }
    constructor(editor) {
        super(editor);
        this.resizeUseRatio = true;
        this.cropUseRatio = true;
        this.clicked = false;
        this.start_x = 0;
        this.start_y = 0;
        this.top_x = 0;
        this.top_y = 0;
        this.width = 0;
        this.height = 0;
        this.activeTab = TABS.resize;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this.ratio = 0;
        this.new_h = 0;
        this.new_w = 0;
        this.diff_x = 0;
        this.diff_y = 0;
        this.cropBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.resizeBox = {
            w: 0,
            h: 0
        };
        this.calcCropBox = () => {
            const node = this.crop_box.parentNode, w = node.offsetWidth * 0.8, h = node.offsetHeight * 0.8;
            let wn = w, hn = h;
            const { naturalWidth: nw, naturalHeight: nh } = this;
            if (w > nw && h > nh) {
                wn = nw;
                hn = nh;
            }
            else if (this.ratio > w / h) {
                wn = w;
                hn = nh * (w / nw);
            }
            else {
                wn = nw * (h / nh);
                hn = h;
            }
            css(this.crop_box, {
                width: wn,
                height: hn
            });
        };
        this.showCrop = () => {
            if (!this.cropImage) {
                return;
            }
            this.calcCropBox();
            const w = this.cropImage.offsetWidth ||
                this.image.offsetWidth ||
                this.image.naturalWidth;
            this.new_w = ImageEditor_1.calcValueByPercent(w, this.o.cropDefaultWidth);
            const h = this.cropImage.offsetHeight ||
                this.image.offsetHeight ||
                this.image.naturalHeight;
            if (this.cropUseRatio) {
                this.new_h = this.new_w / this.ratio;
            }
            else {
                this.new_h = ImageEditor_1.calcValueByPercent(h, this.o.cropDefaultHeight);
            }
            css(this.cropHandler, {
                backgroundImage: 'url(' + attr(this.cropImage, 'src') + ')',
                width: this.new_w,
                height: this.new_h,
                left: w / 2 - this.new_w / 2,
                top: h / 2 - this.new_h / 2
            });
            this.j.e.fire(this.cropHandler, 'updatesize');
        };
        this.updateCropBox = () => {
            if (!this.cropImage) {
                return;
            }
            const ratioX = this.cropImage.offsetWidth / this.naturalWidth, ratioY = this.cropImage.offsetHeight / this.naturalHeight;
            this.cropBox.x = css(this.cropHandler, 'left') / ratioX;
            this.cropBox.y = css(this.cropHandler, 'top') / ratioY;
            this.cropBox.w = this.cropHandler.offsetWidth / ratioX;
            this.cropBox.h = this.cropHandler.offsetHeight / ratioY;
            this.sizes.textContent =
                this.cropBox.w.toFixed(0) + 'x' + this.cropBox.h.toFixed(0);
        };
        this.updateResizeBox = () => {
            this.resizeBox.w = this.image.offsetWidth || this.naturalWidth;
            this.resizeBox.h = this.image.offsetHeight || this.naturalHeight;
        };
        this.setHandlers = () => {
            const self = this;
            const { widthInput, heightInput } = refs(this.editor);
            self.j.e
                .on([
                self.editor.querySelector('.jodit_bottomright'),
                self.cropHandler
            ], `mousedown.${jie}`, this.onResizeHandleMouseDown)
                .on(this.j.ow, `resize.${jie}`, () => {
                this.j.e.fire(self.resizeHandler, 'updatesize');
                self.showCrop();
                this.j.e.fire(self.cropHandler, 'updatesize');
            });
            self.j.e
                .on(toArray(this.editor.querySelectorAll(`.${jie}__slider-title`)), 'click', this.onTitleModeClick)
                .on([widthInput, heightInput], 'input', this.onChangeSizeInput);
            const { keepAspectRatioResize, keepAspectRatioCrop } = refs(this.editor);
            if (keepAspectRatioResize) {
                keepAspectRatioResize.addEventListener('change', () => {
                    this.resizeUseRatio = keepAspectRatioResize.checked;
                });
            }
            if (keepAspectRatioCrop) {
                keepAspectRatioCrop.addEventListener('change', () => {
                    this.cropUseRatio = keepAspectRatioCrop.checked;
                });
            }
            self.j.e
                .on(self.resizeHandler, 'updatesize', () => {
                css(self.resizeHandler, {
                    top: 0,
                    left: 0,
                    width: self.image.offsetWidth || self.naturalWidth,
                    height: self.image.offsetHeight || self.naturalHeight
                });
                this.updateResizeBox();
            })
                .on(self.cropHandler, 'updatesize', () => {
                if (!self.cropImage) {
                    return;
                }
                let new_x = css(self.cropHandler, 'left'), new_y = css(self.cropHandler, 'top'), new_width = self.cropHandler.offsetWidth, new_height = self.cropHandler.offsetHeight;
                if (new_x < 0) {
                    new_x = 0;
                }
                if (new_y < 0) {
                    new_y = 0;
                }
                if (new_x + new_width > self.cropImage.offsetWidth) {
                    new_width = self.cropImage.offsetWidth - new_x;
                    if (self.cropUseRatio) {
                        new_height = new_width / self.ratio;
                    }
                }
                if (new_y + new_height > self.cropImage.offsetHeight) {
                    new_height = self.cropImage.offsetHeight - new_y;
                    if (self.cropUseRatio) {
                        new_width = new_height * self.ratio;
                    }
                }
                css(self.cropHandler, {
                    width: new_width,
                    height: new_height,
                    left: new_x,
                    top: new_y,
                    backgroundPosition: -new_x - 1 + 'px ' + (-new_y - 1) + 'px',
                    backgroundSize: self.cropImage.offsetWidth +
                        'px ' +
                        self.cropImage.offsetHeight +
                        'px'
                });
                self.updateCropBox();
            });
            Object.values(self.buttons).forEach(button => {
                button.onAction(() => {
                    const data = {
                        action: self.activeTab,
                        box: self.activeTab === TABS.resize
                            ? self.resizeBox
                            : self.cropBox
                    };
                    switch (button) {
                        case self.buttons.saveas:
                            self.j.prompt('Enter new name', 'Save in new file', (name) => {
                                if (!trim(name)) {
                                    self.j.alert('The name should not be empty');
                                    return false;
                                }
                                self.onSave(name, data, self.hide, (e) => {
                                    self.j.alert(e.message);
                                });
                            });
                            break;
                        case self.buttons.save:
                            self.onSave(undefined, data, self.hide, (e) => {
                                self.j.alert(e.message);
                            });
                            break;
                        case self.buttons.reset:
                            if (self.activeTab === TABS.resize) {
                                css(self.image, {
                                    width: null,
                                    height: null
                                });
                                widthInput.value = self.naturalWidth.toString();
                                heightInput.value = self.naturalHeight.toString();
                                self.j.e.fire(self.resizeHandler, 'updatesize');
                            }
                            else {
                                self.showCrop();
                            }
                            break;
                    }
                });
            });
        };
        this.options =
            editor && editor.o && editor.o.imageeditor
                ? editor.o.imageeditor
                : Config.defaultOptions.imageeditor;
        const o = this.options;
        this.resizeUseRatio = o.resizeUseRatio;
        this.cropUseRatio = o.cropUseRatio;
        this.buttons = {
            reset: Button(this.j, 'update', 'Reset'),
            save: Button(this.j, 'save', 'Save'),
            saveas: Button(this.j, 'save', 'Save as ...')
        };
        this.activeTab = o.resize ? TABS.resize : TABS.crop;
        this.editor = form(this.j, this.options);
        const { resizeBox, cropBox } = refs(this.editor);
        this.resize_box = resizeBox;
        this.crop_box = cropBox;
        this.sizes = this.editor.querySelector(`.${jie}__area.${jie}__area_crop .jodit-image-editor__sizes`);
        this.resizeHandler = this.editor.querySelector(`.${jie}__resizer`);
        this.cropHandler = this.editor.querySelector(`.${jie}__croper`);
        this._dialog = this.j.dlg({
            buttons: ['fullsize', 'dialog.close']
        });
        this._dialog.setContent(this.editor);
        this._dialog.setSize(this.o.width, this.o.height);
        this._dialog.setHeader([
            this.buttons.reset,
            this.buttons.save,
            this.buttons.saveas
        ]);
        this.setHandlers();
    }
    /** @override */
    destruct() {
        if (this.isDestructed) {
            return;
        }
        if (this._dialog && !this._dialog.isInDestruct) {
            this._dialog.destruct();
        }
        Dom.safeRemove(this.editor);
        if (this.j.e) {
            this.j.e
                .off(this.j.ow, 'mousemove', this.onGlobalMouseMove)
                .off(this.j.ow, 'mouseup', this.onGlobalMouseUp)
                .off(this.ow, `.${jie}`)
                .off(`.${jie}`);
        }
        super.destruct();
    }
};
ImageEditor.calcValueByPercent = (value, percent) => {
    const percentStr = percent.toString();
    const valueNbr = parseFloat(value.toString());
    let match;
    match = /^[-+]?[0-9]+(px)?$/.exec(percentStr);
    if (match) {
        return parseInt(percentStr, 10);
    }
    match = /^([-+]?[0-9.]+)%$/.exec(percentStr);
    if (match) {
        return Math.round(valueNbr * (parseFloat(match[1]) / 100));
    }
    return valueNbr || 0;
};
__decorate([
    autobind
], ImageEditor.prototype, "hide", null);
__decorate([
    autobind
], ImageEditor.prototype, "open", null);
__decorate([
    autobind
], ImageEditor.prototype, "onTitleModeClick", null);
__decorate([
    debounce(),
    autobind
], ImageEditor.prototype, "onChangeSizeInput", null);
__decorate([
    autobind
], ImageEditor.prototype, "onResizeHandleMouseDown", null);
__decorate([
    autobind
], ImageEditor.prototype, "onGlobalMouseUp", null);
__decorate([
    throttle(10)
], ImageEditor.prototype, "onGlobalMouseMove", null);
ImageEditor = ImageEditor_1 = __decorate([
    component
], ImageEditor);
export { ImageEditor };
/**
 * Open Image Editor
 */
export function openImageEditor(href, name, path, source, onSuccess, onFailed) {
    return this.getInstance('ImageEditor', this.o).open(href, (newname, box, success, failed) => call(box.action === 'resize'
        ? this.dataProvider.resize
        : this.dataProvider.crop, path, source, name, newname, box.box)
        .then(ok => {
        if (ok) {
            success();
            if (onSuccess) {
                onSuccess();
            }
        }
    })
        .catch(error => {
        failed(error);
        if (onFailed) {
            onFailed(error);
        }
    }));
}
