/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OrderDisplay } from "@point_of_sale/app/components/order_display/order_display";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

function _agentLog(hypothesisId, location, message, data) {
    // #region agent log
    fetch("http://127.0.0.1:7269/ingest/13fef552-e627-410f-8a2e-e191017354f6", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f1458f" },
        body: JSON.stringify({
            sessionId: "f1458f",
            runId: "pre-fix",
            hypothesisId,
            location,
            message,
            data,
            timestamp: Date.now(),
        }),
    }).catch(() => {});
    // #endregion
}

patch(OrderDisplay.prototype, {
    _lbCurrencyId(order) {
        return (
            order?.currency?.id ||
            order?.currency_id?.id ||
            this.env?.services?.pos?.currency?.id
        );
    },
    get dualSubtotal() {
        const order = this.order;
        if (!order) {
            return "";
        }
        const curId = this._lbCurrencyId(order);
        if (!order.currency?.id && curId) {
            _agentLog("H_currency_order", "order_display.js:dualSubtotal", "order.currency missing; fallback", {
                fallbackCurId: curId,
                orderId: order.id,
            });
        }
        try {
            return formatDualUsdLbpFromConfig(
                order.config_id,
                order.priceExcl,
                this.env.utils,
                curId
            );
        } catch (e) {
            _agentLog("H_currency_order", "order_display.js:dualSubtotal", "format threw", {
                err: String(e),
                orderId: order.id,
            });
            return "";
        }
    },
    get dualTaxes() {
        const order = this.order;
        if (!order) {
            return "";
        }
        const curId = this._lbCurrencyId(order);
        try {
            return formatDualUsdLbpFromConfig(
                order.config_id,
                order.amountTaxes,
                this.env.utils,
                curId
            );
        } catch (e) {
            _agentLog("H_currency_order", "order_display.js:dualTaxes", "format threw", {
                err: String(e),
                orderId: order.id,
            });
            return "";
        }
    },
    get dualTotal() {
        const order = this.order;
        if (!order) {
            return "";
        }
        const curId = this._lbCurrencyId(order);
        try {
            return formatDualUsdLbpFromConfig(
                order.config_id,
                order.priceIncl,
                this.env.utils,
                curId
            );
        } catch (e) {
            _agentLog("H_currency_order", "order_display.js:dualTotal", "format threw", {
                err: String(e),
                orderId: order.id,
            });
            return "";
        }
    },
});
