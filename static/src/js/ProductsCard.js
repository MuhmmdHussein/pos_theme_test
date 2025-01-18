/** @odoo-module */

import {patch} from "@web/core/utils/patch";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import { ProductCard } from "@point_of_sale/app/generic_components/product_card/product_card";

ProductCard.props = {
    ...ProductCard.props,
    onProductMagnifyImageClick: { type: Function, optional: true },
}

patch(ProductCard.prototype, {

    setup(){
        super.setup();
        this.pos = usePos();
    }

})

