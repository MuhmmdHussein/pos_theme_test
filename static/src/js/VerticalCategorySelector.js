/** @odoo-module */

import { Component } from "@odoo/owl";
import { usePos } from "@point_of_sale/app/store/pos_hook";

export class VerticalCategorySelector extends Component {
    static template = "pos_theme.VerticalCategorySelector";
    static props = {
        categories: {
            type: Array,
            element: Object,
            shape: {
                id: Number,
                name: { type: String, optional: true },
                icon: { type: String, optional: true },
                separator: { type: String, optional: true },
                showSeparator: { type: Boolean, optional: true },
                imageUrl: { type: [String, Boolean], optional: true },
            },
        },
        class: { type: String, optional: true },
        selected: { type: Number, optional: true },
        showImage: { type: Boolean, optional: true },
        onClick: { type: Function },
    };
    static defaultProps = {
        class: "",
        showImage: true,
        showSeparator: false,
    };

    setup() {
        super.setup();
        this.pos = usePos();
    }
}
