from odoo import api, models, fields


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    logo = fields.Binary(related='pos_config_id.logo', readonly=False)
    enable_switch_mode = fields.Boolean(related='pos_config_id.enable_switch_mode', readonly=False)

    order_cart_width = fields.Integer(related='pos_config_id.order_cart_width', readonly=False)
    order_line_font_weight = fields.Selection(related='pos_config_id.order_line_font_weight', readonly=False)
    order_line_font_size = fields.Float(related='pos_config_id.order_line_font_size', readonly=False)
    order_summary_font_weight = fields.Selection(related='pos_config_id.order_summary_font_weight', readonly=False)
    order_summary_font_size = fields.Float(related='pos_config_id.order_summary_font_size', readonly=False)
    action_buttons_default_state = fields.Boolean(related='pos_config_id.action_buttons_default_state', readonly=False)

    auto_clear_search_box = fields.Boolean(related='pos_config_id.auto_clear_search_box', readonly=False)
    products_display = fields.Selection(related='pos_config_id.products_display', readonly=False)
    products_display_limit = fields.Integer(related='pos_config_id.products_display_limit', readonly=False)
    product_width = fields.Float(related='pos_config_id.product_width', readonly=False)
    product_height = fields.Float(related='pos_config_id.product_height', readonly=False)
    product_gap = fields.Float(related='pos_config_id.product_gap', readonly=False)
    product_image_width = fields.Integer(related='pos_config_id.product_image_width', readonly=False)
    product_image_height = fields.Integer(related='pos_config_id.product_image_height', readonly=False)
    product_name_font_size = fields.Float(related='pos_config_id.product_name_font_size', readonly=False)
    pos_category_display = fields.Selection(related='pos_config_id.pos_category_display', readonly=False)
    freeze_vertical_category_column = fields.Boolean(
        related='pos_config_id.freeze_vertical_category_column', readonly=False)
    pos_category_width = fields.Float(related='pos_config_id.pos_category_width', readonly=False)
