/** @odoo-module */

import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";

export class ProductListItem extends Component {
    static template = "pos_theme.ProductListItem";

    static props = {
        class: { String, optional: true },
        name: String,
        product: { type: Object },
        productId: Number,
        number: Number,
        price: String,
        imageUrl: [String, Boolean],
        productInfo: { Boolean, optional: true },
        onClick: { type: Function, optional: true },
        onProductInfoClick: { type: Function, optional: true },
        onProductMagnifyImageClick: { type: Function, optional: true },
    };
    static defaultProps = {
        onClick: () => {},
        class: "",
    };

    setup() {
        super.setup(...arguments);
        this.pos = usePos();
    }

}
