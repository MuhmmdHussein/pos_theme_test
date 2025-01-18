/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";

patch(ReceiptScreen.prototype, {

    async onDisplaySendEmail() {
        if ($('.send-email').hasClass('hide_send_mail')) {
            $('.send-email').removeClass('hide_send_mail');
        } else {
            $('.send-email').addClass('hide_send_mail');
        }
    }

});