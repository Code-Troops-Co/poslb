/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Orderline } from "@point_of_sale/app/components/orderline/orderline";
import { _t } from "@web/core/l10n/translation";
import { formatDualUsdLbpFromConfig } from "../utils/lebanon_currency";

const superLineScreenValuesGet = Object.getOwnPropertyDescriptor(
    Orderline.prototype,
    "lineScreenValues"
).get;

patch(Orderline.prototype, {
    get dualLinePrice() {
        const vals = superLineScreenValuesGet.call(this);
        const line = this.line;
        if (!line.order_id || !vals?.price) {
            return vals?.price ?? "";
        }
        if (vals.price === _t("Free")) {
            return vals.price;
        }
        return formatDualUsdLbpFromConfig(
            line.order_id.config_id,
            line.displayPrice,
            this.env.utils,
            line.currency.id
        );
    },
    get dualDisplayPriceUnit() {
        const vals = superLineScreenValuesGet.call(this);
        const line = this.line;
        if (!line.order_id || !vals?.displayPriceUnit) {
            return "";
        }
        const dualUnit = formatDualUsdLbpFromConfig(
            line.order_id.config_id,
            line.displayPriceUnit,
            this.env.utils,
            line.currency.id
        );
        return `${dualUnit} / ${line.product_id?.uom_id?.name || ""}`;
    },
    get dualNoDiscountPrice() {
        const line = this.line;
        if (!line.order_id) {
            return "";
        }
        return formatDualUsdLbpFromConfig(
            line.order_id.config_id,
            line.displayPriceNoDiscount,
            this.env.utils,
            line.currency.id
        );
    },
});
