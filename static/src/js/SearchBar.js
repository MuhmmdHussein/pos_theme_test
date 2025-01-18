/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { SearchBar } from "@point_of_sale/app/screens/ticket_screen/search_bar/search_bar";

patch(SearchBar.prototype, {

    _onSelectFilter(key) {
        super._onSelectFilter(key)
        if(this.state.selectedFilter == 'ACTIVE_ORDERS' || this.state.selectedFilter == 'PAYMENT' || this.state.selectedFilter == 'ONGOING' || this.state.selectedFilter == 'RECEIPT'){
            $('.ticket-screen').addClass('hide_control_button_screen')
            $('.action_button').addClass('hide_action_button')
        }
    }

});
