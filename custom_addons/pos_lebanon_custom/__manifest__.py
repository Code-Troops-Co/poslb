# -*- coding: utf-8 -*-
{
    "name": "Lebanon POS Customizations",
    "version": "19.0.2.0.0",
    "author": "Code Troops",
    "category": "Point of Sale",
    "summary": "Lebanon POS: configurable USD to LBP rate + POS login (minimal frontend)",
    "depends": ["point_of_sale"],
    "data": [
        "views/pos_config_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_lebanon_custom/static/src/app/main.js",
            "pos_lebanon_custom/static/src/app/styles/lebanon_pos.scss",
            "pos_lebanon_custom/static/src/app/utils/lebanon_currency.js",
            "pos_lebanon_custom/static/src/app/patches/product_screen.js",
            "pos_lebanon_custom/static/src/app/patches/product_screen.xml",
            "pos_lebanon_custom/static/src/app/patches/login_screen.js",
            "pos_lebanon_custom/static/src/app/patches/login_screen.xml",
        ],
    },
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}
