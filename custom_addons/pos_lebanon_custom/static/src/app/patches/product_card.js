/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductCard } from "@point_of_sale/app/components/product_card/product_card";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

/**
 * NOTE: ProductCard has NO setup() in core and extends bare Component.
 * We MUST NOT add setup() or call any OWL hooks here — that crashes the
 * component lifecycle. Instead we read `pos` from `this.env.services`
 * which is always available inside the POS app environment.
 */
patch(ProductCard.prototype, {
    get dualProductListPrice() {
        if (this.props.isComboPopup) {
            return "";
        }
        const tmpl = this.props.product;
        if (!tmpl) {
            return "";
        }
        // Access pos via the service registry on env — no hooks needed
        const pos = this.env.services?.pos;
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
