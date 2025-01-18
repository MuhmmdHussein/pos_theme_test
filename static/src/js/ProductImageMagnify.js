/** @odoo-module */

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { _t } from "@web/core/l10n/translation";

export class ProductImageMagnify extends AbstractAwaitablePopup {
    static template = "pos_theme.ProductImageMagnify";
    static defaultProps = {
        title: _t("Magnified Image"),
        confirmText: _t("Add to Cart"),
        productId: false,
    };

}
