/** @odoo-module */

import {patch} from "@web/core/utils/patch";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import {OrderWidget} from "@point_of_sale/app/generic_components/order_widget/order_widget";

patch(OrderWidget.prototype, {

    setup() {
        this.pos = usePos();
    },

    get totalItemsQty(){
        let total_qty = 0;
        for (const line of this.props.lines) {
            total_qty += line.quantity;
        }
        return total_qty;
    },

    get totalItemsUnitPrice(){
        let total_price = 0;
        for (const line of this.props.lines) {
            total_price += line.price;
        }
        return total_price.toFixed(2);
    }

});
