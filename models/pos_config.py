from odoo import api, fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    logo = fields.Binary("Receipt's Logo and POS App Logo")
    enable_switch_mode = fields.Boolean(string="Enable Switch Mode (Moon/Sun)")
    action_buttons_default_state = fields.Boolean(string="Actions Buttons Default State")
    auto_clear_search_box = fields.Boolean('Auto Clear Search Box (product)', default=True)
    products_display = fields.Selection([
        ("card", "Card"),
        ("list", "List")
    ], string="Products Display View", default="card")
    products_display_limit = fields.Integer(
        'Products Display Limit',
        default=50,
        help='Default no. of displayed products on pos',
        required=1
    )
    product_width = fields.Float(
        'Product Width (em)',
        default=9,
        help='Default width of Product box is 18em',
        required=1
    )
    product_height = fields.Float(
        'Product Height (em)',
        default=13,
        help='Default height of Product box is 18em',
        required=1)
    product_gap = fields.Float(
        'Product Gap (em)',
        default=0.5,
        help='Default Gap between Products Box',
        required=1)
    product_image_width = fields.Integer(
        'Product Image Width (%)',
        default=50,
        help="Width of Product's Image, set between 0 to 100"
    )
    product_image_height = fields.Integer(
        'Product Image Height (%)',
        default=50,
        help="Height of Product's Image, set between 0 to 100"
    )
    product_name_font_size = fields.Float(
        'Product Name Font Size (px)',
        default=13,
        help="Font Size of Product's Name, set between 13 to 20"
    )
    pos_category_display = fields.Selection([
        ("horizontal", "Horizontal"),
        ("vertical", "Vertical")
    ], string="Pos Category Display View", default="horizontal")
    freeze_vertical_category_column = fields.Boolean(
        'Freeze Vertical Category Column',
        help="Freeze Vertical Category Column After Select Category"
    )
    pos_category_width = fields.Float(
        'Pos Category Width (em)',
        default=10,
        help='Default width of Product Pos Category box is 14em',
        required=1
    )
    order_cart_width = fields.Integer(
        "Order Cart Width (%)",
        default=30,
        help="Width of Order Cart (left pos screen is order cart, right pos screen is products screen)")
    order_line_font_weight = fields.Selection(string="Order Line Font Weight", selection=[
        ('normal', 'Normal'), ('bold', 'Bold')], default='normal')
    order_line_font_size = fields.Float(string="Order Line Font size (em)", default=0.8)
    order_summary_font_weight = fields.Selection(string="Order Summary Font Weight", selection=[
        ('normal', 'Normal'), ('bold', 'Bold')], default='bold')
    order_summary_font_size = fields.Float(string="Order Summary Font size (em)", default=1)

