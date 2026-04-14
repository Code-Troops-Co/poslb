# -*- coding: utf-8 -*-
{
    "name": "Lebanon POS Customizations",
    "version": "19.0.2.0.2",
    "author": "Code Troops",
    "category": "Point of Sale",
    "summary": "Dual-currency (USD/LBP) and Lebanon-specific POS foundations",
    "depends": ["point_of_sale"],
    "data": [
        "views/pos_config_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_lebanon_custom/static/src/**/*",
        ],
    },
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}
