/** @odoo-module */

import { useState } from "@odoo/owl";
import {patch} from "@web/core/utils/patch";
import {TicketScreen} from "@point_of_sale/app/screens/ticket_screen/ticket_screen";

patch(TicketScreen.prototype, {

    setup() {
        super.setup();
        this.ui = useState({
            ...this.ui,
            showButtons: false,
            showNumpad: true,
        });
        setTimeout(() => {
            var owl = $('.owl-carousel');
            owl.owlCarousel({
                loop: false,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    960: {
                        items: 5
                    },
                    1200: {
                        items: 6
                    }
                }
            });
            owl.on('mousewheel', '.owl-stage', function (e) {
                if (e.originalEvent.wheelDelta > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
        }, 20);
    },

    showHideButtons() {
        this.ui.showButtons = !this.ui.showButtons;
    },

    showHideNumpad() {
        this.ui.showNumpad = !this.ui.showNumpad;
    },

    clearCart(){
        this.pos.removeOrder(this.currentOrder);
        this.pos.selectNextOrder();
    },

    addNewOrder(){
        this.pos.add_new_order();
    },

    get cartWidth() {
        if (this.ui.Small) {
            return ""
        } else {
            return 'width:' + this.pos.config.order_cart_width + '%;max-width:'  + this.pos.config.order_cart_width + '%;'
        }
    },
    
    onMounted() {
        super.onMounted()
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].cart_position && this.pos.pos_theme_settings_data[0].cart_position == 'left_side'){
            $('.leftpane').insertBefore($('.rightpane'));
        }
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'bottom'){
            $('.ticket-screen').addClass('control_button_bottom')
        }else if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'left_side'){
            $('.ticket-screen').addClass('control_button_left')
        }
        else if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'right_side'){
            $('.ticket-screen').addClass('control_button_right')
        }
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].cart_position && this.pos.pos_theme_settings_data[0].action_button_position == 'bottom'){
            $('.ticket-screen').addClass('hide_control_button_screen')
        }
    },
    
    get isOrderSynced(){
        var res = super.isOrderSynced
        if (this._state.ui.filter == "SYNCED") {
            $('.ticket-screen').removeClass('hide_control_button_screen')
            $('.action_button').removeClass('hide_action_button')
        }
        return res
    },

});
