import base64
from odoo import api, fields, models
from .pos_theme_styles import POSThemeStyles


class PosTheme(models.Model):
    _name = 'pos.theme'
    _rec_name = 'name'
    _description = 'Responsive POS Theme'

    name = fields.Char(string="Name", default="Responsive POS Theme")
    cart_position = fields.Selection([('left_side', 'Left Side'), (
        'right_side', 'Right Side')], string="Cart Position", default='left_side', required=True)
    image_display_in_cart = fields.Boolean(
        string="Is Image Display In Cart?")
    action_button_position = fields.Selection([('left_side', 'Left Side'), ('bottom', 'Bottom'), (
        'right_side', 'Right Side')], string="Action Button Position", default='left_side', required=True)
    action_button_font_size = fields.Integer(string="Action Button Font Size (px)", default=15)
    mobile_start_screen = fields.Selection([('product_screen', 'Product Screen'), ('cart_screen', 'Cart Screen')],
                                           string="Startup Screen", default='product_screen', required=True)
    theme_style = fields.Selection([
        ("style_1", "Style 1"),
        ("style_2", "Style 2"),
        ("style_3", "Style 3"),
        ("style_4", "Style 4"),
    ], string="Theme Style", default="style_1", required=True)
    display_product_name = fields.Boolean(
        string="Display Product Name", default="true")
    display_product_price = fields.Boolean(
        string="Display Product Price", default="true")
    display_product_code = fields.Boolean(
        string="Display Product Code", default="true")
    display_product_type = fields.Boolean(string="Display Product Type")
    display_product_forecasted = fields.Boolean(
        string="Display Product Forecasted Quantity")
    display_product_uom = fields.Boolean(string="Display Product UOM")
    primary_color = fields.Char(string="Primary Color")
    secondary_color = fields.Char(string="Secondary Color")
    product_style = fields.Selection([
        ("style_1", "Style 1"),
        ("style_2", "Style 2"),
        ("style_3", "Style 3"),
        ("style_4", "Style 4"),
    ], string="Product Box Style", default="style_1", required=True)
    button_style = fields.Selection([
        ("style_1", "Style 1"),
        ("style_2", "Style 2"),
        ("style_3", "Style 3"),
        ("style_4", "Style 4"),
    ], string="Button Style", default="style_1", required=True)
    body_background_type = fields.Selection([
        ("bg_color", "Color"),
        ("bg_img", "Image")
    ], string="Body Background Type", default="bg_color")

    body_background_color = fields.Char(string="Body Background Color")
    body_background_image = fields.Binary(string="Body Background Image")
    body_font_family = fields.Selection([
        ("Roboto", "Roboto"),
        ("Raleway", "Raleway"),
        ("Poppins", "Poppins"),
        ("Oxygen", "Oxygen"),
        ("OpenSans", "OpenSans"),
        ("KoHo", "KoHo"),
        ("Ubuntu", "Ubuntu"),
        ("Montserrat", "Montserrat"),
        ("Lato", "Lato"),
        ("custom_google_font", "Custom Google Font"),
    ], string="Body Font Family", required=True)

    body_google_font_family = fields.Char(string="Google Font Family")
    is_used_google_font = fields.Boolean(string="Is use google font?")
    list_view_border = fields.Selection([
        ("bordered", "Bordered"),
        ("without_bordered", "Without Border")
    ], string="List View Border", default="bordered", required=True)
    header_sticky = fields.Boolean(string=" Is Header Sticky?")
    list_row_hover = fields.Boolean(string="Rows Hover?")
    hover_background_color = fields.Char(string="Hover Background Color")
    even_row_color = fields.Char(string="Even Row Color")
    odd_row_color = fields.Char(string="Odd Row Color")
    gradient_color = fields.Char(string="Gradient color ")
    form_element_style = fields.Selection([
        ("style_1", "Style 1"),
        ("style_2", "Style 2"),
        ("style_3", "Style 3"),
        ("style_4", "Style 4"),
    ], string="Form Element Style", default="style_1", required=True)
    display_product_image_name = fields.Selection([
        ("image", "Image"),
        ("product_name", "Product Name"), ('image_name', 'Image + Name'),
    ], string="Product Detail", default="image_name", required=True)
    product_background_color = fields.Char(string="Product Background Color")
    display_cart_order_item_count = fields.Boolean("Display Cart Item Qty (Mobile)")
    display_product_cart_qty = fields.Boolean("Display Product Qty")

    @api.onchange('theme_style')
    def onchange_theme_style(self):
        if self.theme_style:
            if POSThemeStyles.get(self.theme_style, False):
                self.update(POSThemeStyles[self.theme_style])

    def _apply_theme(self):
        self.env.registry.clear_all_caches()
        for rec in self:
            attachment_obj = self.env["ir.attachment"]
            attachment_url = f"/pos_theme/static/src/overrides/pos_theme_variables.scss"
            attachment_id = attachment_obj.sudo().search([("url", "=", attachment_url)], limit=1)
            content = """     
                    $cart_position: %(cart_position)s;
                    $image_display_in_cart: %(image_display_in_cart)s;
                    $action_button_position: %(action_button_position)s;
                    $action_button_font_size: %(action_button_font_size)s;
                    $mobile_start_screen: %(mobile_start_screen)s;
                    $pos_theme_style: %(theme_style)s;
                    $pos_primary_color: %(primary_color)s;
                    $pos_secondary_color: %(secondary_color)s;
                    $pos_gradient_color: %(gradient_color)s;
                    $pos_product_style: %(product_style)s;
                    $pos_button_style: %(button_style)s;
                    $pos_body_background_type: %(body_background_type)s;
                    $pos_body_background_color: %(body_background_color)s;
                    $pos_body_background_image: %(body_background_image)s;
                    $pos_body_font_family: %(body_font_family)s;
                    $pos_body_google_font_family: %(body_google_font_family)s;
                    $pos_is_used_google_font: %(is_used_google_font)s;
                    $list_view_border: %(list_view_border)s;
                    $list_row_hover: %(list_row_hover)s;
                    $hover_background_color: %(hover_background_color)s;
                    $even_row_color: %(even_row_color)s;
                    $odd_row_color: %(odd_row_color)s;
                    $header_sticky: %(header_sticky)s;
                    $form_element_style: %(form_element_style)s;
                    $display_product_image_name: %(display_product_image_name)s;
                    $product_background_color: %(product_background_color)s;
                """ % {
                "cart_position": rec.cart_position,
                "image_display_in_cart": rec.image_display_in_cart,
                "action_button_position": rec.action_button_position,
                "action_button_font_size": str(rec.action_button_font_size) + 'px',
                "mobile_start_screen": rec.mobile_start_screen,
                "theme_style": rec.theme_style,
                "primary_color": rec.primary_color,
                "secondary_color": rec.secondary_color,
                "gradient_color": rec.gradient_color,
                "product_style": rec.product_style,
                "button_style": rec.button_style,
                "body_background_type": rec.body_background_type,
                "body_background_color": rec.body_background_color,
                "body_background_image": rec.body_background_image,
                "body_font_family": rec.body_font_family,
                "body_google_font_family": rec.body_google_font_family,
                "is_used_google_font": rec.is_used_google_font,
                "list_view_border": rec.list_view_border,
                "list_row_hover": rec.list_row_hover,
                "even_row_color": rec.even_row_color,
                "odd_row_color": rec.odd_row_color,
                "header_sticky": rec.header_sticky,
                "hover_background_color": rec.hover_background_color,
                "form_element_style": rec.form_element_style,
                "display_product_image_name": rec.display_product_image_name,
                "product_background_color": rec.product_background_color,
            }
            # Check if the file to save had already been modified
            datas = base64.b64encode((content or "\n").encode("utf-8"))
            if attachment_id:
                attachment_id.sudo().write({"datas": datas})
            else:
                attachment_obj.sudo().create({
                    "name": f"POS Config: {self.id} Theme Variables",
                    "type": "binary",
                    "mimetype": "text/scss",
                    "datas": datas,
                    "url": attachment_url,
                    "public": True,
                    "res_model": "ir.ui.view",
                })

    def write(self, values):
        res = super(PosTheme, self).write(values)
        self._apply_theme()
        return res
