/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { CategorySelector } from "@point_of_sale/app/generic_components/category_selector/category_selector";

patch(CategorySelector.prototype, {

    setup(...args) {
        super.setup(...args);
        this.pos = usePos();
    }

})


