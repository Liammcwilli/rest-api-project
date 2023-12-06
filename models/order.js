const pool = require("../db");


class OrderModel {


    async checkExistingOrder(userid, orderid) {
        try {
            const order = await pool.query('SELECT * FROM orders WHERE id = $1 AND userid = $2', [orderid, userid]);
            return order.rows?.length ? order.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    };

    // for create order route
    async addToOrders(userid, cartid) {
        try {

            const newOrder = await pool.query('INSERT INTO orders (userid, totalcost) VALUES ($1, (SELECT totalcost FROM carts WHERE userid = $1 AND id = $2)) RETURNING *', [userid, cartid]);
            return newOrder.rows?.length ? newOrder.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    // for create order route
    async addToOrdersitems(userid, cartid, orderId) {
        try {
            await pool.query('INSERT INTO ordersitems(orderid, productid, quantity)SELECT (SELECT id FROM orders WHERE id = $1), productid, quantity FROM cartsitems WHERE cartid = $2', [orderId, cartid]);
            // you cannot use RETURNING * in INSERT with a SELECT!
        } catch (err) {
            throw new Error(err);
        }
    }

    async getMostRecentOrder(userid) {
        try {
            const order = await pool.query('SELECT * FROM orders WHERE userid = $1 ORDER BY created DESC LIMIT 1', [userid]);
            return order.rows?.length ? order.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getAllOrders(userid) {
        try {
            const allOrders = await pool.query('SELECT * FROM orders WHERE userid = $1', [userid]);
            return allOrders.rows?.length ? allOrders.rows : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getSingleOrder(userid, orderid) {
        try {
            const orderById = await pool.query('SELECT productid, name, price, quantity, price * quantity AS totalcost FROM ordersitems JOIN products ON products.id = ordersitems.productid JOIN orders ON orders.id = ordersitems.orderid WHERE orderid = $1 AND orders.userid = $2;', [orderid, userid]);
            return orderById.rows?.length ? orderById.rows : null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = OrderModel;