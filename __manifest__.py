{
    "name": "pos_theme",

    "summary": "Resala Retail Theme",
    "description": "Resala Retail Theme",

    'category': 'Resala/theme',
    'author': "ResalaSoft",
    'license': "OPL-1",
    'website': "http://www.resalasoft.com",

    "depends": ["pos_base", "pos_hr"],
    "data": [
        # Data
        "data/ir_attachment.xml",
        "data/pos_theme.xml",
        # Security
        "security/ir.model.access.csv",
        # views
        "views/pos_theme.xml",
        "views/res_config_settings.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "/pos_theme/static/src/overrides/pos_theme_variables.scss",
            'pos_theme/static/src/scss/mixin.scss',
            'pos_theme/static/src/scss/pos_common.scss',
            'pos_theme/static/src/libs/js/owl.carousel.js',
            'pos_theme/static/src/libs/css/owl.carousel.css',
            'pos_theme/static/src/libs/css/owl.theme.default.min.css',
            "pos_theme/static/src/xml/*",
            "pos_theme/static/src/js/*",
            "pos_theme/static/src/scss/*",
        ],
    },

    'installable': True,
    'application': True,
    'auto_install': False,
}
