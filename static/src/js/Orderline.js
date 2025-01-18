/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Orderline } from "@point_of_sale/app/generic_components/orderline/orderline";
import { ProductInfoPopup } from "@point_of_sale/app/screens/product_screen/product_info_popup/product_info_popup";

patch(Orderline.prototype, {

    setup(...args) {
        super.setup(...args);
        this.pos = usePos();
        this.popup = useService("popup");
        this.isSelected = false;
        this.numberBuffer = useService("number_buffer");
    },

    clearLine() {
//        this.numberBuffer.sendKey("Backspace");
//        this.numberBuffer.sendKey("Backspace");
        let order_lines = this.props.line.order.orderlines.filter((oline) => oline.uuid == this.props.line.uuid);
        for (const line of order_lines){
            this.props.line.order.removeOrderline(line);
        }
    },

    updateLineQty(quantity) {
        let selectedLine = this.props.line.order.get_selected_orderline()
        selectedLine.set_quantity(selectedLine.quantity + quantity)
    },

    onClick(){
        this.isSelected = !this.isSelected;
    },

    get showButtons(){
        return this.props.class['selected'] || false;
    },

    get lineSequence() {
        let order_lines = this.props.line.order.orderlines
        let uuid = this.props.line.uuid;
        for (let i = 0; i < order_lines.length; i++) {
            let line = order_lines[i];
            if (line.uuid == uuid) {
                return i + 1
            }
        }
    },

    async showProductInfo(){
        let product = this.props.line.product;
        const info = await this.pos.getProductInfo(product, 1);
        this.popup.add(ProductInfoPopup, { info: info, product: product });
    }

})


