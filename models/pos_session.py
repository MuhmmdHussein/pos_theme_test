from odoo import api, fields, models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _pos_data_process(self, loaded_data):
        super()._pos_data_process(loaded_data)
        loaded_data['pos_theme_settings_data_by_theme_id'] = {theme['id']: theme for theme in loaded_data['pos.theme']}

    def _loader_params_product_product(self):
        result = super(PosSession, self)._loader_params_product_product()
        result['search_params']['fields'].extend(["type", "qty_available", "virtual_available"])
        return result

    def _pos_ui_models_to_load(self):
        result = super()._pos_ui_models_to_load()
        theme_model = 'pos.theme'
        if theme_model not in result:
            result.append(theme_model)
        return result

    def _loader_params_pos_theme(self):
        return {'search_params': {'domain': [], 'fields': [], 'load': False}}

    def _get_pos_ui_pos_theme(self, params):
        return self.env['pos.theme'].search_read(**params['search_params'])