/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { onWillUnmount, useState } from "@odoo/owl";
import { ProductListItem } from "@pos_theme/js/ProductListItem";
import { VerticalCategorySelector } from "@pos_theme/js/VerticalCategorySelector";
import { ProductImageMagnify } from "@pos_theme/js/ProductImageMagnify"
import { ProductsWidget } from "@point_of_sale/app/screens/product_screen/product_list/product_list";

ProductsWidget.components = {
    ...ProductsWidget.components,
    ProductListItem,
    VerticalCategorySelector
};

patch(ProductsWidget.prototype, {

    setup(){
        super.setup();
        onWillUnmount(() => {
            this.pos.top_selling_products = null;
        });
        this.state = useState({
            showAllCategories: true,
        });
    },

    async onProductMagnifyImageClick(product) {
        let { confirmed } = await this.popup.add(ProductImageMagnify, {
            title: _t(product.display_name),
            productId: product.id,
        });
        if (confirmed) {
            this.pos.addProductToCurrentOrder(product)
        }
    },

    actionShowAllCategories(){
        this.state.showAllCategories = true;
        this.pos.setSelectedCategoryId(0)
    },

    onClickCategory(category_id){
        if (!this.pos.config.freeze_vertical_category_column){
            this.state.showAllCategories = false;
        }
        this.pos.setSelectedCategoryId(category_id)
    },

    get selectedCategoryName(){
        return this.pos.selectedCategoryId ? this.pos.db.category_by_id[this.pos.selectedCategoryId].name : false;
    },

    getVerticalCategories() {
        return [
            ...this.pos.db.get_category_ancestors_ids(0),
            0,
            ...this.pos.db.get_category_childs_ids(0),
        ]
            .map((id) => this.pos.db.category_by_id[id])
            .map((category) => {
                const isRootCategory = category.id === this.pos.db.root_category_id;
                const showSeparator =
                    !isRootCategory &&
                    [
                        ...this.pos.db.get_category_ancestors_ids(this.pos.selectedCategoryId),
                        this.pos.selectedCategoryId,
                    ].includes(category.id);
                return {
                    id: category.id,
                    name: !isRootCategory ? category.name : "",
                    icon: isRootCategory ? "fa-home fa-2x" : "",
                    separator: "fa-caret-right",
                    showSeparator,
                    imageUrl:
                        category?.has_image &&
                        `/web/image?model=pos.category&field=image_128&id=${category.id}&unique=${category.write_date}`,
                };
            });
    },

    get productsToDisplay() {
        let productsWillDisplay = super.productsToDisplay;
        let topSellingProducts = this.pos.top_selling_products
        if (topSellingProducts) {
            productsWillDisplay = topSellingProducts
        }
        return productsWillDisplay
    }

});
