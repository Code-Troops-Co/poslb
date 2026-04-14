/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ComboConfiguratorPopup } from "@point_of_sale/app/components/popups/combo_configurator_popup/combo_configurator_popup";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(ComboConfiguratorPopup.prototype, {
    /**
     * Show extra combo item price as "± $X.XX | ± Y,YYY L.L."
     */
    formattedComboPrice(comboItem) {
        if (this.pos.currency.isZero(comboItem.extra_price)) {
            return "";
        }
        const sign = comboItem.extra_price < 0 ? "- " : "+ ";
        const abs = Math.abs(comboItem.extra_price);
        return sign + formatDualUsdLbpFromConfig(
            this.pos.config,
            abs,
            this.env.utils,
            this.pos.currency?.id
        );
    },
});
