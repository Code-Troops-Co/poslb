/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { LoginScreen } from "@point_of_sale/app/screens/login_screen/login_screen";

patch(LoginScreen.prototype, {
    setup() {
        super.setup(...arguments);
        this.lebanonState = useState({
            lebanonLogin: "",
            lebanonPassword: "",
            lebanonError: "",
            lebanonBusy: false,
        });
    },
    async onLebanonSubmit() {
        this.lebanonState.lebanonError = "";
        if (!this.lebanonState.lebanonLogin?.trim() || !this.lebanonState.lebanonPassword) {
            this.lebanonState.lebanonError = _t("Please enter user name and password.");
            return;
        }
        this.lebanonState.lebanonBusy = true;
        try {
            const res = await this.pos.data.call("res.users", "lebanon_pos_verify_credentials", [
                this.lebanonState.lebanonLogin.trim(),
                this.lebanonState.lebanonPassword,
                this.pos.config.id,
            ]);
            if (!res.ok) {
                this.lebanonState.lebanonError = res.error || _t("Login failed.");
                return;
            }
            let user = this.pos.models["res.users"].get(res.user_id);
            if (!user) {
                await this.pos.data.read("res.users", [res.user_id], ["id", "name", "partner_id"]);
                user = this.pos.models["res.users"].get(res.user_id);
            }
            if (!user) {
                this.lebanonState.lebanonError = _t("User record could not be loaded in this terminal.");
                return;
            }
            user._role = res._role;
            this.lebanonState.lebanonPassword = "";
            this.selectOneCashier(user);
        } catch (e) {
            this.lebanonState.lebanonError = e?.message || _t("Login failed.");
        } finally {
            this.lebanonState.lebanonBusy = false;
        }
    },
});
