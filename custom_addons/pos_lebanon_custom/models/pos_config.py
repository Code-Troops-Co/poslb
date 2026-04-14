# -*- coding: utf-8 -*-

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    lebanon_lbp_per_usd = fields.Float(
        string="LBP per 1 USD",
        digits=(16, 2),
        default=89500.0,
        help="Display and Cash LBP conversion: multiply USD amounts by this rate.",
    )
