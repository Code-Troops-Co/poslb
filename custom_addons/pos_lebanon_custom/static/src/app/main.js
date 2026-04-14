/** @odoo-module **/

import "./styles/lebanon_pos.scss";

// Core screens
import "./patches/product_screen";
import "./patches/action_pad";
import "./patches/receipt_screen";
import "./patches/login_screen";

// Order / orderline dual currency
import "./patches/orderline";
import "./patches/order_display";

// Product card dual price
import "./patches/product_card";

// Payment flow
import "./patches/payment_screen";
import "./patches/payment_lines";
import "./patches/payment_status";
import "./patches/pos_store_patch";

// Popup dual currency
import "./patches/product_configurator_popup";
import "./patches/combo_configurator_popup";
import "./patches/optional_products_popup";
import "./patches/product_info_popup";
import "./patches/opening_control_popup";
