/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/services/pos_store";
import { formatLbpPlain, getLebanonLbpPerUsd, usdToLbp } from "../utils/lebanon_currency";

patch(PosStore.prototype, {
    getPaymentMethodFmtAmount(pm, order) {
        const base = super.getPaymentMethodFmtAmount(...arguments);
        if (!base) {
            return base;
        }
        const amount = order.getDefaultAmountDueToPayIn(pm);
        const rate = getLebanonLbpPerUsd(this.config);
        const lbp = formatLbpPlain(usdToLbp(amount, rate));
        return `${base} | ${lbp}`;
    },
});
