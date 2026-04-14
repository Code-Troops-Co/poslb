/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OrderDisplay } from "@point_of_sale/app/components/order_display/order_display";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(OrderDisplay.prototype, {
    get dualSubtotal() {
        const order = this.order;
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.priceExcl,
            this.env.utils,
            order.currency.id
        );
    },
    get dualTaxes() {
        const order = this.order;
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.amountTaxes,
            this.env.utils,
            order.currency.id
        );
    },
    get dualTotal() {
        const order = this.order;
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.priceIncl,
            this.env.utils,
            order.currency.id
        );
    },
});
