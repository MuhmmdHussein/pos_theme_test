/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { loadImage } from "@point_of_sale/utils";
import { useService } from "@web/core/utils/hooks";
import { getDataURLFromFile } from "@web/core/utils/urls";
import { useState, useExternalListener } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";

export class PosThemePopUp extends AbstractAwaitablePopup {
    static template = "pos_theme.PosThemePopUp";
    static defaultProps = {
        cancelText: _t("Close"),
        title: _t("Update POS Theme"),
    };

    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        this.popup = useService("popup");
        this.changes = {
            logo: this.pos.config.logo,
            products_display: this.pos.config.products_display,
            product_width: this.pos.config.product_width,
            product_height: this.pos.config.product_height,
            product_gap: this.pos.config.product_gap,
            product_image_width: this.pos.config.product_image_width,
            product_image_height: this.pos.config.product_image_height,
            product_name_font_size: this.pos.config.product_name_font_size,
            pos_category_display: this.pos.config.pos_category_display,
            freeze_vertical_category_column: this.pos.config.freeze_vertical_category_column,
            pos_category_width: this.pos.config.pos_category_width,
            order_cart_width: this.pos.config.order_cart_width,
            order_line_font_size: this.pos.config.order_line_font_size,
            order_line_font_weight: this.pos.config.order_line_font_weight,
            order_summary_font_size: this.pos.config.order_summary_font_size,
            order_summary_font_weight: this.pos.config.order_summary_font_weight,
        }
        this.state = useState(this.changes);
        useExternalListener(window, 'keyup', this._keyUp);
    }

    _keyUp(event) {
        if (event.key == 'Enter') {
            this.confirm()
        }
    }

    async OnChange(event) {
        if (event.target.type == 'checkbox') {
            this.changes[event.target.name] = event.target.checked;
        }
        if (event.target.type == 'file') {
            const file = event.target.files[0];
            if (!file.type.match(/image.*/)) {
                await this.popup.add(ErrorPopup, {
                    title: _t("Unsupported File Format"),
                    body: _t("Only web-compatible Image formats such as .png or .jpeg are supported."),
                });
            } else {
                const imageUrl = await getDataURLFromFile(file);
                const loadedImage = await loadImage(imageUrl, {
                    onError: () => {
                        this.popup.add(ErrorPopup, {
                            title: _t("Loading Image Error"),
                            body: _t("Encountered error when loading image. Please try again."),
                        });
                    }
                });
                if (loadedImage) {
                    const resizedImage = await this._resizeImage(loadedImage, 800, 600);
                    this.changes[event.target.name] = resizedImage.toDataURL().split(',')[1];
                }
            }
        }
        if (!['checkbox', 'file'].includes(event.target.type)) {
            this.changes[event.target.name] = event.target.value;
        }
        if (event.target.name == 'order_cart_width' && (event.target.value >= 100 || event.target.value <=0)) {
            event.target.value = 35
        }
        this.pos.config[event.target.name] = this.changes[event.target.name]
        await this.orm.call("pos.config", "write", [[this.pos.config.id], this.changes]);
    }

    get configImageUrl() {
        const config = this.pos.config;
        if (config.logo) {
            return 'data:image/png;base64,' + config.logo;
        } else {
            return false;
        }
    }

    _resizeImage(img, max_width, max_height) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var ratio = 1;

        if (img.width > max_width) {
            ratio = max_width / img.width;
        }
        if (img.height * ratio > max_height) {
            ratio = max_height / img.height;
        }
        var width = Math.floor(img.width * ratio);
        var height = Math.floor(img.height * ratio);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        return canvas;
    }

    getPayload() {
        return this.changes
    }

}