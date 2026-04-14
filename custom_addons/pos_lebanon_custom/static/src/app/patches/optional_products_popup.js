/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OptionalProductPopup } from "@point_of_sale/app/components/popups/optional_products_popup/optional_products_popup";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(OptionalProductPopup.prototype, {
    /**
     * Returns "$ X.XX | Y,YYY L.L." for the optional product's list price.
     * @param {object} productTemplate
     */
    dualOptionalPrice(productTemplate) {
        if (!productTemplate) {
            return "";
        }
        const order = this.pos.getOrder();
        const pricelist = order?.pricelist_id;
        const price = productTemplate.getPrice(pricelist, 1, 0, false, false);
        return formatDualUsdLbpFromConfig(
            this.pos.config,
            price,
            this.env.utils,
            this.pos.currency?.id
        );
    },
});
