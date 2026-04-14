/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { BaseProductAttribute } from "@point_of_sale/app/components/popups/product_configurator_popup/product_configurator_popup";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

/**
 * Patch the base attribute component so every variant extra-price badge
 * (Radio, Pills, Select, Color, Image) shows dual USD | LBP.
 */
patch(BaseProductAttribute.prototype, {
    /**
     * Returns "± $X.XX | ±Y,YYY L.L." for any non-zero price_extra.
     * Falls back to the original formatter if pos config is unavailable.
     */
    getFormatPriceExtra(val) {
        if (!val) {
            return "";
        }
        const sign = val < 0 ? "- " : "+ ";
        const abs = Math.abs(val);
        const config = this.pos?.config;
        if (!config) {
            return sign + this.env.utils.formatCurrency(abs);
        }
        const dual = formatDualUsdLbpFromConfig(
            config,
            abs,
            this.env.utils,
            this.pos.currency?.id
        );
        return sign + dual;
    },
});
