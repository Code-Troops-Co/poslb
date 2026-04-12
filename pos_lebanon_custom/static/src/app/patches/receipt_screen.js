/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";

patch(ReceiptScreen.prototype, {
    /**
     * Placeholder for WhatsApp receipt integration (Twilio, Meta Cloud API, etc.).
     * @returns {Promise<void>}
     */
    async sendReceiptViaWhatsApp() {
        const order = this.currentOrder;
        const partner = order.getPartner();
        const phone = this.state.phone || partner?.phone || partner?.mobile || "";
        this.notification.add(
            _t(
                "WhatsApp is not wired yet (order %s, phone %s). Implement sendReceiptViaWhatsApp().",
                order.name || order.uuid,
                phone || "-"
            ),
            { type: "info" }
        );
        return Promise.resolve();
    },
});
