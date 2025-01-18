from odoo import api, fields, models


class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    def get_top_selling_products(self, limit):
        sql = f"""
            SELECT product_id, sum(qty)
            FROM {self._table}
            GROUP BY product_id
            ORDER BY sum(qty) DESC
            LIMIT {limit}
        """
        self.env.cr.execute(sql)
        return self.env.cr.fetchall()
