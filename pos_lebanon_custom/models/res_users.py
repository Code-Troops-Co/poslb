# -*- coding: utf-8 -*-

from odoo import api, models
from odoo.exceptions import AccessDenied


class ResUsers(models.Model):
    _inherit = "res.users"

    @api.model
    def lebanon_pos_verify_credentials(self, login, password, pos_config_id):
        """Verify PoS cashier credentials without switching the browser session."""
        config = self.env["pos.config"].browse(pos_config_id)
        config.check_access("read")

        user = self.sudo().search([("login", "=", login)], limit=1)
        if not user or not user.active:
            return {"ok": False, "error": "Invalid credentials"}

        if not user.has_group("point_of_sale.group_pos_user"):
            return {"ok": False, "error": "User is not allowed to use Point of Sale"}

        try:
            UsersModel = self.env.registry["res.users"]
            UsersModel.check(self.env.cr.dbname, user.id, password)
        except AccessDenied:
            return {"ok": False, "error": "Invalid credentials"}

        role = "manager" if user.has_group("point_of_sale.group_pos_manager") else "cashier"
        return {
            "ok": True,
            "user_id": user.id,
            "name": user.name,
            "partner_id": user.partner_id.id,
            "_role": role,
        }
