/** @odoo-module */

import { session } from "@web/session";
import { patch } from "@web/core/utils/patch";
import { CashierName } from "@point_of_sale/app/navbar/cashier_name/cashier_name";

patch(CashierName.prototype, {

    get username() {
        name = super.username
        return name + " (" + session.db + ")";
    }

});
