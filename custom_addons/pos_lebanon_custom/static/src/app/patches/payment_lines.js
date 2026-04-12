/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { PaymentScreenPaymentLines } from "@point_of_sale/app/screens/payment_screen/payment_lines/payment_lines";
import { NumberPopup } from "@point_of_sale/app/components/popups/number_popup/number_popup";
import { enhancedButtons } from "@point_of_sale/app/components/numpad/numpad";
import { formatDualUsdLbp, formatLbpPlain, getLebanonLbpPerUsd, usdToLbp } from "../utils/lebanon_currency";
import { formatLbpPaymentAmount, paymentLineUsesLbp } from "../utils/lebanon_payment_mode";

patch(PaymentScreenPaymentLines.prototype, {
    formatPaymentLineDisplay(line) {
        if (paymentLineUsesLbp(line)) {
            return formatLbpPaymentAmount(line.getAmount(), this.pos);
        }
        return formatDualUsdLbp(this.pos, line.getAmount(), this.env.utils);
    },
    async selectLine(paymentline) {
        this.props.selectLine(paymentline.uuid);
        if (this.ui.isSmall) {
            const startingValue = paymentLineUsesLbp(paymentline)
                ? String(Math.round(usdToLbp(paymentline.getAmount(), getLebanonLbpPerUsd(this.pos.config))))
                : this.env.utils.formatCurrency(paymentline.getAmount(), false);
            this.dialog.add(NumberPopup, {
                title: _t("New amount"),
                buttons: enhancedButtons(),
                startingValue,
                getPayload: (num) => {
                    this.props.updateSelectedPaymentline(parseFloat(num));
                },
            });
        }
    },
});
