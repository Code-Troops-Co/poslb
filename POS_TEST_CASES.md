# Lebanon POS – Complete Test Case Guide

**Module:** `pos_lebanon_custom`  
**Odoo version:** 19.0  
**Test environment:** `code-troops-co-poslb-main-*.dev.odoo.com`

---

## Prerequisites

| Step | Action |
|------|--------|
| 1 | Install module **Lebanon POS Customizations** |
| 2 | Open **Point of Sale → Configuration → Settings** |
| 3 | Set **LBP per 1 USD** = `89500` (or any value > 0) |
| 4 | Ensure at least one **Cash USD** payment method (type = Cash, name does NOT contain "lbp" or "ليرة") |
| 5 | Create a **Cash LBP** payment method (type = Cash, name contains "LBP" or "ليرة") |
| 6 | Create a **Card** payment method (type = Bank) |
| 7 | Open a POS session |

---

## TC-01 · Module loads without errors

| # | Check | Expected |
|---|-------|----------|
| 1.1 | Open POS session | No JS error dialog |
| 1.2 | Browser console | Zero `TypeError` / `Cannot read properties` errors |
| 1.3 | Odoo server logs | No Python `ERROR` or `WARNING` lines related to `pos_lebanon_custom` |

---

## TC-02 · Layout – Right sidebar (desktop)

| # | Action | Expected |
|---|--------|----------|
| 2.1 | Open POS on a desktop browser (≥ 992 px wide) | A vertical sidebar appears to the RIGHT of the product grid |
| 2.2 | Sidebar top area | Category buttons are displayed in a single-column list |
| 2.3 | Sidebar middle | "Actions" label + "More Options" button visible |
| 2.4 | Sidebar footer | Exchange rate badge: `1 USD = 89,500 L.L.` |
| 2.5 | Click **More Options** | `ControlButtonsPopup` dialog opens |
| 2.6 | Open POS on mobile / narrow viewport | Sidebar is HIDDEN; bottom mobile bar shows instead |

---

## TC-03 · Numpad always visible

| # | Action | Expected |
|---|--------|----------|
| 3.1 | Empty order | Numpad is NOT shown (correct, order is empty) |
| 3.2 | Add 1 product | Numpad appears BELOW the orderline summary |
| 3.3 | Add 10+ products (long order list) | Scroll the orderline list — the Numpad and Pay button remain visible WITHOUT scrolling the left pane |
| 3.4 | Select any orderline | Numpad is active and accepts input |

---

## TC-04 · Dual currency – Product card

| # | Action | Expected |
|---|--------|----------|
| 4.1 | View any product card in the grid | Two-line price: `$ X.XX | Y,YYY L.L.` below the product name |
| 4.2 | Change LBP rate to `100000` in config | Prices update on next POS reload |
| 4.3 | Product with $0 price | Shows `$ 0.00 | 0 L.L.` or blank (not a crash) |

---

## TC-05 · Dual currency – Orderlines

| # | Action | Expected |
|---|--------|----------|
| 5.1 | Add a product to the order | Orderline shows `$ X.XX | Y,YYY L.L.` for line total |
| 5.2 | Change quantity to 3 | Price scales correctly in both currencies |
| 5.3 | Apply a 10 % discount | Crossed-out original price AND discounted price shown in dual format |
| 5.4 | Orderline with "Free" product | Shows "Free" (not a dual price) |

---

## TC-06 · Dual currency – Order summary totals

| # | Action | Expected |
|---|--------|----------|
| 6.1 | Add multiple products | Subtotal, Tax, and **Total** rows all show `$ X.XX | Y,YYY L.L.` |
| 6.2 | Total = `$ 1,085.60` at 89,500 rate | LBP = `97,161,200 L.L.` (matches screenshot) |

---

## TC-07 · Dual currency – Pay button (ActionPad)

| # | Action | Expected |
|---|--------|----------|
| 7.1 | Order has items | The **Payment** button shows a small LBP sub-line: e.g. `97,161,200 L.L.` |
| 7.2 | Empty order | Sub-line is NOT shown |

---

## TC-08 · Payment screen – Big bucket buttons

| # | Action | Expected |
|---|--------|----------|
| 8.1 | Click **Payment** | Payment screen shows three large buttons: `Cash USD`, `Cash LBP`, `Card` + `Other methods` |
| 8.2 | Click **Cash USD** | A USD cash payment line is added at the full order total |
| 8.3 | Click **Cash LBP** | A Cash LBP payment line is added; numpad shows value IN LBP (e.g. `97161200`) |
| 8.4 | Click **Card** | A bank/card payment line is added |
| 8.5 | Click **Other methods** | A selection popup lists ALL configured payment methods |
| 8.6 | No matching method configured | Warning notification + fallback to "Other methods" popup |

---

## TC-09 · Payment screen – LBP numpad conversion

| # | Action | Expected |
|---|--------|----------|
| 9.1 | Add Cash LBP line | Numpad buffer displays the LBP equivalent (e.g. `97161200`) |
| 9.2 | Type `100000000` in numpad with LBP line selected | Amount stored = `100000000 / 89500 ≈ 1117.32 USD` |
| 9.3 | Select a USD line then back to LBP line | Numpad resets to LBP value of that line |
| 9.4 | Payment due row | Shows `$ X.XX | Y,YYY L.L.` (dual format) |
| 9.5 | Change amount (remaining / overpay) | "Remaining" and "Change" rows show correct dual format |

---

## TC-10 · Payment screen – Rate bar

| # | Action | Expected |
|---|--------|----------|
| 10.1 | View payment screen | Bottom bar: `1 USD = 89,500 L.L.` |

---

## TC-11 · Payment screen – Total due dual

| # | Action | Expected |
|---|--------|----------|
| 11.1 | Large total amount display | Shows `$ 1,085.60 | 97,161,200 L.L.` |

---

## TC-12 · Product Configurator popup (variants)

| # | Action | Expected |
|---|--------|----------|
| 12.1 | Click a configurable product (e.g. "Conference Chair" with Steel/Aluminium legs) | Configurator dialog opens |
| 12.2 | Aluminium option has extra `+ $6.40` | Shows `+ $ 6.40 | + 572,800 L.L.` |
| 12.3 | Negative extra (discount variant) | Shows `- $ X.XX | - Y,YYY L.L.` |

---

## TC-13 · Combo configurator popup

| # | Action | Expected |
|---|--------|----------|
| 13.1 | Add a combo product | Combo configurator dialog opens with product cards |
| 13.2 | Combo item with extra price | Extra price badge shows `+ $ X.XX | + Y,YYY L.L.` |

---

## TC-14 · Optional Products popup

| # | Action | Expected |
|---|--------|----------|
| 14.1 | Add a product that has optional products configured | Optional Products dialog appears |
| 14.2 | Each optional product row | Shows a dual price line under the product name |

---

## TC-15 · Product Info popup

| # | Action | Expected |
|---|--------|----------|
| 15.1 | Long-press a product → Product Info | Dialog opens |
| 15.2 | Dialog header | Shows product name + `$ X.XX` (core) + LBP dual sub-line below |
| 15.3 | Financials section | "Price excl. Tax" and "Price incl. Tax" rows have LBP sub-lines |

---

## TC-16 · Login screen

| # | Action | Expected |
|---|--------|----------|
| 16.1 | Open POS (session with multiple cashiers or PIN required) | Custom form shows: Username + Password fields + "Log in" button |
| 16.2 | Submit with wrong password | Error message: "Invalid credentials" |
| 16.3 | Submit with non-POS user | Error: "User is not allowed to use Point of Sale" |
| 16.4 | Submit with valid POS cashier | Logged in successfully; POS main screen shown |
| 16.5 | Submit with valid POS manager | Logged in as manager (`_role = 'manager'`) |
| 16.6 | Submit empty form | Validation message: "Please enter user name and password" |

---

## TC-17 · Receipt screen

| # | Action | Expected |
|---|--------|----------|
| 17.1 | Complete a payment | Receipt screen shows "Payment Successful" banner |
| 17.2 | LBP sub-line in banner | Shows e.g. `97,161,200 L.L.` below the USD total |
| 17.3 | WhatsApp button | Green "Send receipt on WhatsApp" button visible |
| 17.4 | Click WhatsApp button | Info notification: "WhatsApp is not wired yet (order …, phone …)" |

---

## TC-18 · Exchange rate display

| # | Action | Expected |
|---|--------|----------|
| 18.1 | Product screen (desktop) | Sidebar footer: `1 USD = 89,500 L.L.` |
| 18.2 | Product screen (mobile) | Bottom bar: `1 USD = 89,500 L.L.` |
| 18.3 | Payment screen | Bottom bar same |
| 18.4 | Change rate to 0 in config | Falls back to default `89,500` (never shows 0 or NaN) |

---

## TC-19 · Edge cases & resilience

| # | Scenario | Expected |
|---|----------|----------|
| 19.1 | `lebanon_lbp_per_usd` field not yet migrated (null in DB) | Falls back to 89,500; no crash |
| 19.2 | Payment line without UUID | `markPaymentLineLbp` is a no-op; no crash |
| 19.3 | Order with zero total | All dual displays show `$ 0.00 | 0 L.L.` |
| 19.4 | Negative refund order | Dual price shows negative values correctly |
| 19.5 | Very large amount (> 1B LBP) | Number formatted with thousand separators, no overflow |
| 19.6 | Product with no pricelist | `getPrice(null, 1, …)` returns list price; dual price shows correctly |
| 19.7 | No "Cash LBP" method configured | Quick pay shows warning + opens all methods |
| 19.8 | No "Card" method configured | Same fallback behavior |

---

## TC-20 · Backend configuration

| # | Action | Expected |
|---|--------|----------|
| 20.1 | Go to POS → Configuration → POS Config → Edit | "Lebanon dual currency" group with "LBP per 1 USD" field is visible |
| 20.2 | Change rate to `90000`, save, reload POS | All LBP prices recalculate at 90,000 rate |
| 20.3 | Open another POS config (if multiple exist) | Rate shown is specific to that config, not shared |

---

## Quick regression checklist (before each release)

- [ ] TC-01 (no crash on load)
- [ ] TC-03.3 (numpad visible with long orders)
- [ ] TC-05.1 (orderline dual price)
- [ ] TC-08.3 (Cash LBP payment flow end-to-end)
- [ ] TC-09.2 (LBP → USD conversion accuracy)
- [ ] TC-12.2 (configurator extra price dual)
- [ ] TC-16.4 (login with valid cashier)
- [ ] TC-19.1 (null rate fallback)
