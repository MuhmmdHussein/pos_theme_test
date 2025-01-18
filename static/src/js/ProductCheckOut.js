/** @odoo-module */

import { session } from "@web/session";
import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { PosThemePopUp } from "@pos_theme/js/PosThemePopUp";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { PartnerListScreen } from "@point_of_sale/app/screens/partner_list/partner_list";
import {Component, onMounted, onWillUnmount, useExternalListener, useState} from "@odoo/owl";

export class ProductCheckOut extends Component {
    static template = "pos_theme.ProductCheckOut";

    setup() {
        this.pos = usePos();
        this.ui = useService("ui");
        this.popup = useService("popup");
        this.orm = useService("orm");
        this.notification = useService("pos_notification");
        this.state = useState({
            inputCustomer: '',
            countCustomers: 0
        });
    }

    async UpdatePOSTheme() {
        await this.popup.add(PosThemePopUp)
    }

    async createPartner() {
        const { country_id, state_id } = this.pos.company;
        const { confirmed, payload: newPartner } = await this.popup.add(PartnerListScreen, {
            partner: { country_id, state_id, lang: session.user_context.lang },
            editModeProps: true
        });
        if (confirmed) {
            this.pos.get_order().set_partner(newPartner);
        }
        const popups = Object.values(this.popup.popups);
        for (const popup of popups) {
            popup.props.close();
        }
    }

    async setProductsDisplay() {
        if (this.pos.config.products_display == 'card') {
            this.pos.config.products_display = 'list'
        } else {
            this.pos.config.products_display = 'card'
        }
        await this.orm.call("pos.config", "write", [[this.pos.config.id], {
            "products_display": this.pos.config.products_display
        }]);
    }

    async setProductsDisplayLimit() {
        const {confirmed, payload: number} = await this.popup.add(NumberPopup, {
            title: _t('How many Products need Display on Products Screen'),
            startingValue: this.pos.db.limit,
        })
        if (confirmed) {
            if (number > 0) {
                if (number > 1000) {
                    return this.popup.add(ErrorPopup, {
                        title: _t('Warning'),
                        body: _t('Maximum can set is 1000')
                    })
                } else {
                    this.pos.db.limit = parseInt(number)
                    await this.orm.call("pos.config", "write", [[this.pos.config.id], {
                        "products_display_limit": parseInt(number)
                    }]);
                }
            } else {
                 this.notification.add(_t("Required number bigger than 0"), 3000);
            }
        }
    }

    async addCategory() {
//        let {confirmed, payload: results} = await this.showPopup('PopUpCreateCategory', {
//            title: this.env._t('Create new Category')
//        })
//        if (confirmed && results['name']) {
//            let value = {
//                name: results.name,
//                sequence: results.sequence
//            }
//            if (results.parent_id != 'null') {
//                value['parent_id'] = results['parent_id']
//            }
//            if (results.image_128) {
//                value['image_128'] = results.image_128.split(',')[1];
//            }
//            let category_id = await this.rpc({
//                model: 'pos.category',
//                method: 'create',
//                args: [value]
//            })
//            let newCategories = await this.rpc({
//                model: 'pos.category',
//                method: 'search_read',
//                args: [[['id', '=', category_id]]],
//            })
//            const pos_categ_model = this.env.pos.get_model('pos.category');
//            if (pos_categ_model) {
//                pos_categ_model.loaded(this.env.pos, newCategories, {});
//            }
//            this.render()
//            await this.reloadMasterData()
//            this.showPopup('ConfirmPopup', {
//                title: this.env._t('Successfully'),
//                body: this.env._t('New POS Category just created, and append to your POS Category list'),
//                disableCancelButton: true,
//            })
//        } else {
//            return this.env.pos.alert_message({
//                title: this.env._t('Error'),
//                body: this.env._t('Category Name is required')
//            })
//        }
    }

    async addProduct() {
//        let {confirmed, payload: results} = await this.showPopup('PopUpCreateProduct', {
//            title: this.env._t('Create new Product')
//        })
//        if (confirmed && results) {
//            let value = {
//                name: results.name,
//                list_price: results.list_price,
//                default_code: results.default_code,
//                barcode: results.barcode,
//                standard_price: results.standard_price,
//                type: results.type,
//                available_in_pos: true
//            }
//            if (results.pos_categ_id != 'null') {
//                value['pos_categ_id'] = results['pos_categ_id']
//            }
//            if (results.product_brand_id != 'null') {
//                value['product_brand_id'] = parseInt(results['product_brand_id'])
//            } else {
//                value['product_brand_id'] = null
//            }
//            if (results.image_1920) {
//                value['image_1920'] = results.image_1920.split(',')[1];
//            }
//            await this.rpc({
//                model: 'product.product',
//                method: 'create',
//                args: [value]
//            })
//            await this.reloadMasterData()
//            this.env.pos.alert_message({
//                title: results.name,
//                body: this.env._t('Added to Products Screen now !!!'),
//                color: 'success'
//            })
//        }
    }

    async getProductsTopSelling() {
        const {confirmed, payload: number} = await this.popup.add(NumberPopup, {
            title: _t('How many Products top Selling you need to show ?'),
            startingValue: 10,
        })
        if (confirmed) {
            if (number > 0){
                const products  = await this.orm.call(
                    "pos.order.line",
                    "get_top_selling_products",
                    [[], parseInt(number)]
                );
                let search_extends_results = []
                this.pos.top_selling_products = {}
                if (products.length > 0) {
                    for (let index in products) {
                        let product_id = products[index][0];
                        let sold_qty = products[index][1];
                        this.pos.top_selling_products[product_id] = sold_qty
                        let product = this.pos.db.get_product_by_id(product_id);
                        if (product) {
                            search_extends_results.push(product)
                        }
                    }
                }
                if (search_extends_results.length > 0) {
                    this.pos.top_selling_products = search_extends_results
                }
            }else {
                 this.notification.add(_t("Required number bigger than 0"), 3000);
            }
        }

    }

    async onKeyDown(event) {
        const order = this.pos.get_order();
        if (event.key === 'Enter' && this.state.inputCustomer != '') {
            const partners = this.pos.db.search_partner(this.state.inputCustomer)
            this.state.countCustomers = partners.length
            if (partners.length > 1) {
                let partnerLst = []
                for (let i = 0; i < partners.length; i++) {
                    let p = partners[i]
                    partnerLst.push({
                        item: p,
                        id: p.id,
                        label: p.name,
                        isSelected: false
                    })
                }
                let {confirmed, payload: partner} = await this.popup.add(SelectionPopup, {
                    title: _t('All Customers matched with input: [ ' + this.state.inputCustomer + ' ]'),
                    list: partnerLst
                })
                if (confirmed) {
                    order.set_partner(partner);
                    this.state.countCustomers = 0
                    this.state.inputCustomer = ''
                }
            }else if (partners.length == 1) {
                order.set_partner(partners[0]);
                this.state.inputCustomer = ''
                this.state.countCustomers = 0
            } else{
                this.notification.add(_t("Sorry, We not Found any Customer with Your Type"), 3000);
            }
        } else {
            const partners = this.pos.db.search_partner(this.state.inputCustomer)
            this.state.countCustomers = partners.length
        }
    }

    resetPartner(){
        this.pos.get_order().set_partner(null);
    }
}
