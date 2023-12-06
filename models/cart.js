
const pool = require("../db");

class CartModel {

    async checkExistingCart(id) {
        try {
            const cart = await pool.query('SELECT * FROM carts WHERE id = (SELECT id FROM carts WHERE userid = $1)', [id]);
            return cart.rows?.length ? cart.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createCart(id) {
        try {
            const data = await pool.query('INSERT INTO carts(userid) VALUES ($1) RETURNING *', [id]);
            if (data.rows?.length) {
                const insertedCart = data.rows[0];
                return { message: 'Cart successfully created', cart: insertedCart };
            } else {
                return null; // Handle the case where the insertion was not successful
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async getAllProductsFromCart(cartid) {
        try {
            const data = await pool.query(`SELECT products.id AS productid, products.name AS product_name, products.price AS price_per_unit, cartsitems.quantity AS quantity FROM cartsitems JOIN products ON products.id = cartsitems.productid WHERE cartsitems.cartid = $1 ORDER BY products.id`, [cartid]);
            return data.rows?.length ? data.rows : [];
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async checkExistingProductInCart(id, productid) {
        try {
            const product = await pool.query(`SELECT * FROM carts JOIN cartsitems ON carts.id = cartsitems.cartid WHERE carts.userid = $1 AND cartsitems.productid = $2`, [id, productid]);
            return product.rows?.length ? product.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async addNewProductToCart(id, cartid, productid, quantity) {
        try {
            const data = await pool.query(`INSERT INTO cartsitems (cartid, productid, quantity) VALUES ($1, $2, $3) RETURNING *`, [cartid, productid, quantity]);
            return data.rows?.length ? data.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async updateTotalCost(cartid) {
        try {
            await pool.query('UPDATE carts SET totalcost = (SELECT SUM(price * quantity) FROM products JOIN cartsitems ON products.id = cartsitems.productid WHERE cartid = $1) WHERE id = $1 RETURNING totalcost', [cartid]);
        } catch (err) {
            throw new Error(err);
        }
    };

    async deleteCart(id) {
        try {
            await pool.query('DELETE FROM cartsitems WHERE cartid = (SELECT id FROM carts WHERE userid = $1)', [id]);
            await pool.query('DELETE FROM carts WHERE userid = $1', [id]);
            console.log('Cart deleted successfully');
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async removeProductFromCart(id, cartid, productid) {
        try {
            await pool.query('DELETE FROM cartsitems WHERE cartid = $1 AND productid = $2', [cartid, productid]);
            
        } catch (err) {
            throw new Error(err);
        }
    }
    
       
        async removeAllProductsFromCart(cartid) {
            try {
                await pool.query('DELETE FROM cartsitems WHERE cartid = $1', [cartid])
            } catch (err) {
                throw new Error(err);
            }
        }

        async addOneProduct(cartid, productid) {
            try {
                const data = await pool.query('with updated as (UPDATE cartsitems SET quantity = quantity + 1 WHERE cartid = $1 AND productid = $2 RETURNING *) SELECT * FROM updated ORDER BY productid', [cartid, productid]);
                return data.rows?.length ? data.rows[0] : null;
                
            } catch (err) {
                throw new Error(err);
            }
        }
    
        async minusOneProduct(cartid, productid) {
            try {
                const data = await pool.query('with updated as (UPDATE cartsitems SET quantity = quantity - 1 WHERE cartid = $1 AND productid = $2 RETURNING *) SELECT * FROM updated ORDER BY productid', [cartid, productid]);
                return data.rows?.length ? data.rows[0] : null;
                
            } catch (err) {
                throw new Error(err);
            }
        }
    
}

module.exports = CartModel;