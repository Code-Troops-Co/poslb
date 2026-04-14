/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";
import { formatLbpPlain, getLebanonLbpPerUsd, usdToLbp } from "../utils/lebanon_currency";

patch(ActionpadWidget.prototype, {
    /**
     * Returns the LBP equivalent of the current order total,
     * shown as a secondary line inside the Pay button.
     * Returns empty string when the order is empty.
     */
    get dualPayTotal() {
        const order = this.currentOrder;
        if (!order || order.isEmpty()) {
            return "";
        }
        const rate = getLebanonLbpPerUsd(this.pos.config);
        return formatLbpPlain(usdToLbp(order.getTotalWithTax(), rate));
    },
});
