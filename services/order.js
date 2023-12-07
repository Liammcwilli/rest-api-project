const OrderModel = require('../models/order');
const CartService = require('./cart');

const OrderModelInstance = new OrderModel;
const CartServiceInstance = new CartService;

class OrderService {

    async createOrder(userid, cartid) {
        try {
            console.log('Creating a new order...');
            const newOrder = await OrderModelInstance.addToOrders(userid, cartid);
            if (!newOrder) {
                console.log('Failed to create a new order');
                return null;
            }
            console.log('New order created:', newOrder);
    
            console.log('Adding order to order products...');
            await OrderModelInstance.addToOrdersitems(userid, cartid, newOrder.id);
    
            console.log('Fetching single order...');
            const orderCheck = await OrderModelInstance.getSingleOrder(userid, newOrder.id);
            if (!orderCheck) {
                console.log('Failed to fetch the order');
                return null;
            }
            console.log('Fetched order:', orderCheck);
    
            console.log('Deleting cart...');
            const deleteCart = await CartServiceInstance.deleteCart(userid);
            if (deleteCart) {
                console.log('Cart deleted');
                return newOrder;
            } else {
                console.log('Failed to delete cart');
                return null;
            }
        } catch (err) {
            throw(err);
        }
    }
    async getMostRecentOrder(userid) {
        try {
            console.log('Fetching most recent order...');
            const order = await OrderModelInstance.getMostRecentOrder(userid);
            console.log('Most recent order retrieved successfully.');
            return order;
        } catch (err) {
            console.error('Error in getMostRecentOrder:', err);
            throw err;
        }
    }

    async getAllOrders(userid) {
        try {
            console.log('Fetching all orders...');
            const allOrders = await OrderModelInstance.getAllOrders(userid);
            console.log('All orders retrieved successfully.');
            return allOrders;
        } catch (err) {
            console.error('Error in getAllOrders:', err);
            throw err;
        }
    }

    async getSingleOrder(id, orderid) {
        try {
            console.log('Checking for existing order...');
            const exists = await OrderModelInstance.checkExistingOrder(id, orderid);
            if (!exists) {
                console.log('Order does not exist.');
                return null;
            }
            console.log('Fetching single order...');
            const order = await OrderModelInstance.getSingleOrder(id, orderid);
            console.log('Single order retrieved successfully.');
            return order;
        } catch (err) {
            console.error('Error in getSingleOrder:', err);
            throw err;
        }
    }
}

module.exports = OrderService;