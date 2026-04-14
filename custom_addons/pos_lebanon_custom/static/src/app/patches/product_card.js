/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductCard } from "@point_of_sale/app/components/product_card/product_card";
import {
    getLebanonLbpPerUsd,
    usdToLbp,
    formatLbpPlain,
} from "../utils/lebanon_currency";

/**
 * ProductCard extends bare Component with NO setup().
 * We MUST NOT add setup() or call any OWL hooks.
 * We access pos store via this.env.services which is safe.
 * We use list_price directly — no getPrice() calls — to avoid
 * any method-chain crashes from pricelist/variant resolution.
 */
patch(ProductCard.prototype, {
    get dualProductListPrice() {
        if (this.props.isComboPopup) {
            return "";
        }
        const product = this.props.product;
        if (!product) {
            return "";
        }
        const pos = this.env?.services?.pos;
        if (!pos?.config) {
            return "";
        }
        const price = product.list_price;
        if (price == null || price === 0) {
            return "";
        }
        const rate = getLebanonLbpPerUsd(pos.config);
        return formatLbpPlain(usdToLbp(price, rate));
    },
});
