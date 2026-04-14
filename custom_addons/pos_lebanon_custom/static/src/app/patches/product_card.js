/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductCard } from "@point_of_sale/app/components/product_card/product_card";
import { usePos } from "@point_of_sale/app/hooks/pos_hook";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(ProductCard.prototype, {
    setup() {
        super.setup(...arguments);
        this.pos = usePos();
    },
    get dualProductListPrice() {
        const tmpl = this.props.product;
        if (!tmpl || this.props.isComboPopup) {
            return "";
        }
        const order = this.pos.getOrder();
        const pricelist = order?.pricelist_id;
        const price = tmpl.getPrice(pricelist, 1, 0, false, false);
        return formatDualUsdLbpFromConfig(
            this.pos.config,
            price,
            this.env.utils,
            this.pos.currency.id
        );
    },
});
