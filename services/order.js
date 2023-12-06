const OrderModel = require('../models/order-model');
const CartService = require('./cart-service');

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
            await OrderModelInstance.addToOrdersProducts(userid, cartid, newOrder.id);
    
            console.log('Fetching single order...');
            const orderCheck = await OrderModelInstance.getSingleOrder(userid, newOrder.id);
            if (!orderCheck) {
                console.log('Failed to fetch the order');
                return null;
            }
            console.log('Fetched order:', orderCheck);
    
            console.log('Deleting cart...');
            const deleteCart = await CartServiceInstance.deleteCart(cartid);
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

    async getMostRecentOrder(id) {
        try {
            const order = await OrderModelInstance.getMostRecentOrder(id);
            return order;
        } catch (err) {
            throw(err);
        }
    }

    async getAllOrders(id) {
        try {
            const allOrders = await OrderModelInstance.getAllOrders(id);
            return allOrders;
        } catch (err) {
            throw(err);
        }
    }

    async getSingleOrder(id, orderid) {
        try {
            const exists = await OrderModelInstance.checkExistingOrder(id, orderid);
            if(!exists) return null;
            const order = await OrderModelInstance.getSingleOrder(id, orderid);
            return order;
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = OrderService;