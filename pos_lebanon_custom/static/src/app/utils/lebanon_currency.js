/** @odoo-module **/

/** @param {object} config pos.config */
export function getLebanonLbpPerUsd(config) {
    const raw = config?.lebanon_lbp_per_usd;
    const n = typeof raw === "number" ? raw : parseFloat(raw);
    return n > 0 ? n : 89500;
}

export function usdToLbp(usdAmount, rate) {
    return Math.round((usdAmount || 0) * rate);
}

export function lbpToUsd(lbpAmount, rate) {
    if (!rate) {
        return 0;
    }
    return (lbpAmount || 0) / rate;
}

export function formatLbpPlain(lbpValue) {
    const n = Math.round(lbpValue || 0);
    return `${n.toLocaleString()} L.L.`;
}

/**
 * @param {object} config - pos.config record
 * @param {number} usdAmount
 * @param {object} envUtils - this.env.utils from POS components
 * @param {number|undefined} currencyId - pos order currency
 */
export function formatDualUsdLbpFromConfig(config, usdAmount, envUtils, currencyId) {
    const rate = getLebanonLbpPerUsd(config);
    const curId = currencyId;
    const usdStr = envUtils.formatCurrency(usdAmount, curId);
    const lbpStr = formatLbpPlain(usdToLbp(usdAmount, rate));
    return `${usdStr} | ${lbpStr}`;
}

/**
 * @param {object} pos - pos store
 * @param {number} usdAmount
 * @param {object} envUtils
 */
export function formatDualUsdLbp(pos, usdAmount, envUtils) {
    return formatDualUsdLbpFromConfig(pos.config, usdAmount, envUtils, pos.currency?.id);
}

/**
 * For payment lines stored in USD but shown as LBP entry.
 */
export function formatLbpPaymentAmount(usdAmount, pos) {
    const rate = getLebanonLbpPerUsd(pos.config);
    return formatLbpPlain(usdToLbp(usdAmount, rate));
}
