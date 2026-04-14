/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OpeningControlPopup } from "@point_of_sale/app/components/popups/opening_control_popup/opening_control_popup";
import { parseFloat } from "@web/views/fields/parsers";
import { formatLbpPlain, getLebanonLbpPerUsd, usdToLbp } from "../utils/lebanon_currency";

patch(OpeningControlPopup.prototype, {
    /**
     * Reactively returns the LBP equivalent of whatever the cashier typed
     * in the opening cash input (which is always in USD).
     * Returns "" when the input is blank or invalid.
     */
    get openingCashLbp() {
        const raw = this.state?.openingCash;
        if (!raw) {
            return "";
        }
        let usd;
        try {
            usd = parseFloat(raw);
        } catch {
            return "";
        }
        if (!isFinite(usd) || usd < 0) {
            return "";
        }
        const rate = getLebanonLbpPerUsd(this.pos.config);
        return formatLbpPlain(usdToLbp(usd, rate));
    },
});
