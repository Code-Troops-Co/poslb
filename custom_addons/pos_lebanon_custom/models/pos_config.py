# -*- coding: utf-8 -*-

from odoo import api, fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    lebanon_lbp_per_usd = fields.Float(
        string="LBP per 1 USD",
        digits=(16, 2),
        default=89500.0,
        help="Display and Cash LBP conversion: multiply USD amounts by this rate.",
    )

    @api.model
    def _load_pos_data_fields(self, config):
        fields = super()._load_pos_data_fields(config) or []
        if "lebanon_lbp_per_usd" not in fields:
            return list(fields) + ["lebanon_lbp_per_usd"]
        return list(fields)
