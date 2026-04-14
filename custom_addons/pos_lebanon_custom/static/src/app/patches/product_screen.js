/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { getLebanonLbpPerUsd } from "../utils/lebanon_currency";

patch(ProductScreen.prototype, {
    formatLebanonRate() {
        return getLebanonLbpPerUsd(this.pos.config);
    },
});
