/** @odoo-module **/

import "./styles/lebanon_pos.scss";

import "./patches/product_screen";
import "./patches/orderline";
import "./patches/order_display";
import "./patches/product_card";
import "./patches/payment_screen";
import "./patches/payment_lines";
import "./patches/payment_status";
import "./patches/pos_store_patch";
import "./patches/login_screen";
import "./patches/receipt_screen";

// #region agent log
fetch("http://127.0.0.1:7269/ingest/13fef552-e627-410f-8a2e-e191017354f6", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f1458f" },
    body: JSON.stringify({
        sessionId: "f1458f",
        runId: "pre-fix",
        hypothesisId: "H_merge",
        location: "pos_lebanon_custom/static/src/app/main.js:boot",
        message: "pos_lebanon_custom bundle finished static imports",
        data: { ok: true },
        timestamp: Date.now(),
    }),
}).catch(() => {});
// #endregion
