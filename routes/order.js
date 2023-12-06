const express = require('express');
const checkAuthorized = require('../helper/checkAuthorized');

const OrderService = require('../services/order');

const OrderServiceInstance = new OrderService;

const orderRouter = express.Router();

//gets all orders for customer
orderRouter.get('/history/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await OrderServiceInstance.getAllOrders(req.params.id);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

//creates order from cart
orderRouter.post('/new/:id/:cartid', checkAuthorized, async (req, res, next) => {
    try {
        const response = await OrderServiceInstance.createOrder(req.params.id, req.params.cartid);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

//gets most recent order
orderRouter.get('/recent/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await OrderServiceInstance.getMostRecentOrder(req.params.id);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

//gets single order
orderRouter.get('/single/:id/:orderid', checkAuthorized, async (req, res, next) => {
    try {
        // cartId becomes orderId when the cart is processed
        const response = await OrderServiceInstance.getSingleOrder(req.params.id, req.params.orderid);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

module.exports = orderRouter;