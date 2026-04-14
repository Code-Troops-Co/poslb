/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { SelectionPopup } from "@point_of_sale/app/components/popups/selection_popup/selection_popup";
import { formatDualUsdLbp, getLebanonLbpPerUsd, lbpToUsd } from "../utils/lebanon_currency";
import {
    markPaymentLineLbp,
    paymentLineUsesLbp,
    paymentMethodIsLbpCash,
} from "../utils/lebanon_payment_mode";

patch(PaymentScreen.prototype, {
    get dualTotalDue() {
        return formatDualUsdLbp(this.pos, this.currentOrder.totalDue, this.env.utils);
    },
    formatLebanonRate() {
        return getLebanonLbpPerUsd(this.pos.config);
    },
    lebanonResolveMethod(kind) {
        const methods = this.payment_methods_from_config;
        if (kind === "usd") {
            return methods.find((m) => m.type === "cash" && !paymentMethodIsLbpCash(m));
        }
        if (kind === "lbp") {
            return methods.find((m) => paymentMethodIsLbpCash(m));
        }
        if (kind === "card") {
            return (
                methods.find((m) => m.type === "bank") ||
                methods.find((m) => m.type && m.type !== "cash" && m.type !== "pay_later")
            );
        }
        return null;
    },
    async lebanonQuickPay(kind) {
        const pm = this.lebanonResolveMethod(kind);
        if (!pm) {
            this.notification.add(
                _t("No payment method matches this button. Configure Cash (USD), Cash (LBP), or Card."),
                { type: "warning" }
            );
            return this.lebanonOpenAllPaymentMethods();
        }
        await this.addNewPaymentLine(pm);
    },
    lebanonOpenAllPaymentMethods() {
        const list = this.payment_methods_from_config.map((pm, i) => ({
            id: pm.id,
            label: pm.name,
            isSelected: i === 0,
            item: pm,
        }));
        this.dialog.add(SelectionPopup, {
            title: _t("Payment method"),
            list,
            getPayload: (selected) => {
                if (selected) {
                    this.addNewPaymentLine(selected);
                }
            },
        });
    },
    lebanonSyncBufferFromSelectedLine() {
        const line = this.selectedPaymentLine;
        if (!line) {
            return;
        }
        const rate = getLebanonLbpPerUsd(this.pos.config);
        if (paymentLineUsesLbp(line)) {
            this.numberBuffer.set(String(Math.round(line.getAmount() * rate)));
        } else {
            this.numberBuffer.set(String(line.getAmount() === 0 ? "" : line.getAmount()));
        }
    },
    async addNewPaymentLine(paymentMethod) {
        const res = await super.addNewPaymentLine(...arguments);
        if (res) {
            const line = this.paymentLines.at(-1);
            if (line) {
                markPaymentLineLbp(line.uuid, paymentMethodIsLbpCash(paymentMethod));
                this.lebanonSyncBufferFromSelectedLine();
            }
        }
        return res;
    },
    selectPaymentLine(uuid) {
        super.selectPaymentLine(...arguments);
        this.lebanonSyncBufferFromSelectedLine();
    },
    updateSelectedPaymentline(amount = false) {
        const line = this.selectedPaymentLine;
        let passAmount = amount;
        if (line && paymentLineUsesLbp(line) && amount === false) {
            const raw = this.numberBuffer.get();
            if (raw !== null && raw !== "") {
                passAmount = lbpToUsd(this.numberBuffer.getFloat(), getLebanonLbpPerUsd(this.pos.config));
            }
        } else if (line && paymentLineUsesLbp(line) && typeof amount === "number") {
            passAmount = lbpToUsd(amount, getLebanonLbpPerUsd(this.pos.config));
        }
        return super.updateSelectedPaymentline(passAmount);
    },
});
