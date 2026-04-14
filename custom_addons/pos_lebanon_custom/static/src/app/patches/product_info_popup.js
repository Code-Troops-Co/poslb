/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductInfoPopup } from "@point_of_sale/app/components/popups/product_info_popup/product_info_popup";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

patch(ProductInfoPopup.prototype, {
    _dualFormat(usdAmount) {
        return formatDualUsdLbpFromConfig(
            this.pos.config,
            usdAmount,
            this.env.utils,
            this.pos.currency?.id
        );
    },

    get dualHeaderPrice() {
        const price = this.props.info?.productInfo?.all_prices?.price_with_tax;
        if (price == null) {
            return "";
        }
        return this._dualFormat(price);
    },

    get dualPriceExclTax() {
        const price = this.props.info?.productInfo?.all_prices?.price_without_tax;
        if (price == null) {
            return "";
        }
        return this._dualFormat(price);
    },

    get dualPriceInclTax() {
        const price = this.props.info?.productInfo?.all_prices?.price_with_tax;
        if (price == null) {
            return "";
        }
        return this._dualFormat(price);
    },
});
