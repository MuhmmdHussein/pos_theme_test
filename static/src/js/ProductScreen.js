/** @odoo-module */

import { useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { ProductCheckOut } from "@pos_theme/js/ProductCheckOut";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";

ProductScreen.components = {
    ...ProductScreen.components,
    ProductCheckOut
};

patch(ProductScreen.prototype, {

    setup() {
        super.setup();
        this.ui = useState({
            ...this.ui,
            showButtons: this.pos.config.action_buttons_default_state,
            showNumpad: false,
            showExchange: false
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
    
    onMounted() {
        super.onMounted()
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].cart_position && this.pos.pos_theme_settings_data[0].cart_position == 'right_side'){
            $('.rightpane').insertBefore($('.leftpane'));
        }
        if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'bottom'){
            $('.product-screen').addClass('control_button_bottom')
        }else if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'left_side'){
            $('.product-screen').addClass('control_button_left')
        }else if(this && this.pos && this.pos.pos_theme_settings_data && this.pos.pos_theme_settings_data[0] && this.pos.pos_theme_settings_data[0].action_button_position && this.pos.pos_theme_settings_data[0].action_button_position == 'right_side'){
            $('.product-screen').addClass('control_button_right')
        }


        if (window.innerWidth <= 767.98) {
            if (this.pos.pos_theme_settings_data[0].mobile_start_screen == "product_screen") {
                $(".leftpane").css("display", "none");
                $(".rightpane").css("display", "flex");
                $(".cart_management").css("display", "none");
                $(".product_management").removeClass("hide_cart_screen_show");
                $(".product_management").css("display", "flex");
            }
            if (this.pos.pos_theme_settings_data[0].mobile_start_screen == "cart_screen") {
                $(".rightpane").css("display", "none");
                $(".leftpane").css("display", "flex");
                $(".product_management").css("display", "none");
                $(".cart_management").removeClass("hide_product_screen_show");
                $(".cart_management").css("display", "flex");
                $(".search-box").css("display", "none");
            }
        }
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
        if (this.ui.isSmall) {
            return ""
        } else {
            return 'width:' + this.pos.config.order_cart_width + '%;max-width:'  + this.pos.config.order_cart_width + '%;'
        }
    },

    getNumpadButtons() {
        const buttons = super.getNumpadButtons()
        const plus_minus_button = buttons.find(b => b.value == "-")
        plus_minus_button["disabled"] = this.pos.config.disable_plus_minus
        return buttons
    }

});
