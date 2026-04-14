/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { _t } from "@web/core/l10n/translation";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

const superLineScreenValuesGet = Object.getOwnPropertyDescriptor(
    Orderline.prototype,
    "lineScreenValues"
).get;

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

patch(Orderline.prototype, {
    _lbCurrencyId() {
        return (
            this.line?.currency?.id ||
            this.line?.order_id?.currency_id?.id ||
            this.env?.services?.pos?.currency?.id
        );
    },
    get dualLinePrice() {
        const vals = superLineScreenValuesGet.call(this);
        const line = this.line;
        if (!line.order_id || !vals?.price) {
            return vals?.price ?? "";
        }
        if (vals.price === _t("Free")) {
            return vals.price;
        }
        const curId = this._lbCurrencyId();
        if (!line.currency?.id && curId) {
            _agentLog("H_currency", "orderline.js:dualLinePrice", "line.currency missing; using fallback id", {
                fallbackCurId: curId,
                lineId: line.id,
            });
        }
        try {
            return formatDualUsdLbpFromConfig(
                line.order_id.config_id,
                line.displayPrice,
                this.env.utils,
                curId
            );
        } catch (e) {
            _agentLog("H_currency", "orderline.js:dualLinePrice", "formatDualUsdLbpFromConfig threw", {
                err: String(e),
                lineId: line.id,
                hasUtils: !!this.env?.utils,
                curId,
            });
            return vals?.price ?? "";
        }
    },
    get dualDisplayPriceUnit() {
        const vals = superLineScreenValuesGet.call(this);
        const line = this.line;
        if (!line.order_id || !vals?.displayPriceUnit) {
            return "";
        }
        const curId = this._lbCurrencyId();
        try {
            const dualUnit = formatDualUsdLbpFromConfig(
                line.order_id.config_id,
                line.displayPriceUnit,
                this.env.utils,
                curId
            );
            return `${dualUnit} / ${line.product_id?.uom_id?.name || ""}`;
        } catch (e) {
            _agentLog("H_currency", "orderline.js:dualDisplayPriceUnit", "format threw", {
                err: String(e),
                lineId: line.id,
            });
            return `${vals.displayPriceUnit} / ${line.product_id?.uom_id?.name || ""}`;
        }
    },
    get dualNoDiscountPrice() {
        const line = this.line;
        if (!line.order_id) {
            return "";
        }
        const curId = this._lbCurrencyId();
        try {
            return formatDualUsdLbpFromConfig(
                line.order_id.config_id,
                line.displayPriceNoDiscount,
                this.env.utils,
                curId
            );
        } catch (e) {
            _agentLog("H_currency", "orderline.js:dualNoDiscountPrice", "format threw", {
                err: String(e),
                lineId: line.id,
            });
            return "";
        }
    },
});
