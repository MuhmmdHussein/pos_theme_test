/** @odoo-module */

import { useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { useService } from '@web/core/utils/hooks';
import { Navbar } from "@point_of_sale/app/navbar/navbar";

patch(Navbar.prototype, {

    setup() {
        super.setup();
        this.state = useState({
            ...this.state,
            pos_night_mode: false,
        });
        this.ui = useState(useService("ui"));
    },

    switchMode(){
        if (this.state.pos_night_mode){
            $(".pos").addClass("pos_night_mode")
        }else{
            $(".pos").toggleClass("pos_night_mode")
        }
    },

    get cart_item_count(){
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0].display_cart_order_item_count && this.pos.get_order()){
            return this.pos.get_order().get_orderlines().length
        }else{
            return 0
        }
    }

});
