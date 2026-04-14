/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OrderDisplay } from "@point_of_sale/app/components/order_display/order_display";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(OrderDisplay.prototype, {
    _lbCurrencyId(order) {
        return (
            order?.currency?.id ||
            order?.currency_id?.id ||
            this.pos?.currency?.id ||
            this.env?.services?.pos?.currency?.id
        );
    },
    get dualSubtotal() {
        const order = this.order;
        if (!order) {
            return "";
        }
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.priceExcl,
            this.env.utils,
            this._lbCurrencyId(order)
        );
    },
    get dualTaxes() {
        const order = this.order;
        if (!order) {
            return "";
        }
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.amountTaxes,
            this.env.utils,
            this._lbCurrencyId(order)
        );
    },
    get dualTotal() {
        const order = this.order;
        if (!order) {
            return "";
        }
        return formatDualUsdLbpFromConfig(
            order.config_id,
            order.priceIncl,
            this.env.utils,
            this._lbCurrencyId(order)
        );
    },
});
