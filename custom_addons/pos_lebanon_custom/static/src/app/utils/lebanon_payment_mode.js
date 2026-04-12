/** @odoo-module **/

/** @type {Map<string, boolean>} pos.payment uuid -> display as LBP cash */
export const lebanonLbpPaymentLineIds = new Map();

export function paymentMethodIsLbpCash(method) {
    const n = (method?.name || "").toLowerCase();
    return method?.type === "cash" && (n.includes("lbp") || n.includes("ليرة"));
}

export function markPaymentLineLbp(uuid, flag) {
    if (!uuid) {
        return;
    }
    if (flag) {
        lebanonLbpPaymentLineIds.set(uuid, true);
    } else {
        lebanonLbpPaymentLineIds.delete(uuid);
    }
}

export function paymentLineUsesLbp(line) {
    if (!line?.uuid) {
        return false;
    }
    if (lebanonLbpPaymentLineIds.get(line.uuid)) {
        return true;
    }
    return paymentMethodIsLbpCash(line.payment_method_id);
}
