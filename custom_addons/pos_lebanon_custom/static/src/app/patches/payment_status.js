/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/hooks/pos_hook";
import { PaymentScreenStatus } from "@point_of_sale/app/screens/payment_screen/payment_status/payment_status";
import { formatDualUsdLbp } from "../utils/lebanon_currency";
import { formatLbpPaymentAmount, paymentLineUsesLbp } from "../utils/lebanon_payment_mode";

patch(PaymentScreenStatus.prototype, {
    setup() {
        super.setup(...arguments);
        this.pos = usePos();
    },
    get dualStatusAmount() {
        const order = this.order;
        const line = order.getSelectedPaymentline();
        const amount = this.isRemaining ? order.remainingDue : order.change;
        if (line && paymentLineUsesLbp(line)) {
            return formatLbpPaymentAmount(amount, this.pos);
        }
        return formatDualUsdLbp(this.pos, amount, this.env.utils);
    },
});
