/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductCard } from "@point_of_sale/app/components/product_card/product_card";
import { usePos } from "@point_of_sale/app/hooks/pos_hook";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

// ProductCard has NO setup() in core OWL component — we define it fresh here.
patch(ProductCard.prototype, {
    setup() {
        // Component base has no setup, so do NOT call super.setup()
        this._lbPos = usePos();
    },
    get dualProductListPrice() {
        const tmpl = this.props.product;
        if (!tmpl || this.props.isComboPopup) {
            return "";
        }
        const pos = this._lbPos;
        if (!pos?.config) {
            return "";
        }
        try {
            const order = pos.getOrder();
            const pricelist = order?.pricelist_id;
            const price = tmpl.getPrice(pricelist, 1, 0, false, false);
            return formatDualUsdLbpFromConfig(
                pos.config,
                price,
                this.env.utils,
                pos.currency?.id
            );
        } catch {
            return "";
        }
    },
});
