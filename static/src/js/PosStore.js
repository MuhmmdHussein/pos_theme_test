/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";

patch(PosStore.prototype, {

    async _processData(loadedData) {
        await super._processData(...arguments);
        this.db.limit = this.config.products_display_limit;
        this.pos_theme_settings_data = loadedData['pos.theme'] || [];
        this.pos_theme_settings_data_by_theme_id = loadedData?.pos_theme_settings_data_by_theme_id || []
    },

    get_product_image_url(product_id,write_date){
        return `/web/image?model=product.product&field=image_128&id=${product_id}&write_date=${write_date}&unique=1`;
    },

    async setup(env, { popup, orm, number_buffer, hardware_proxy, barcode_reader, ui }) {
        await super.setup(env, { popup, orm, number_buffer, hardware_proxy, barcode_reader, ui });
        if(this.pos_theme_settings_data && this.pos_theme_settings_data[0] && this.pos_theme_settings_data[0].mobile_start_screen && this.pos_theme_settings_data[0].mobile_start_screen == 'cart_screen'){
            this.mobile_pane = "left";
        }
    },

    get cart_item_count(){
        if(this.pos_theme_settings_data && this.pos_theme_settings_data[0].display_cart_order_item_count && this.get_order()){
            return this.get_order().get_orderlines().length
        }else{
            return 0
        }
    },

    getReceiptHeaderData(order) {
        const result = super.getReceiptHeaderData(...arguments);
        result.logo = this.config.logo ? "/web/image?model=pos.config&field=logo&id=" + this.config.id : false;
        return result;
    }

});
