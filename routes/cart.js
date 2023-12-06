const express = require('express');
const checkAuthorized = require('../helper/checkAuthorized');

const CartService = require('../services/cart');

const CartServiceInstance = new CartService;

const cartRouter = express.Router();

//get cartid by user id
cartRouter.get('/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.checkCart(req.params.id);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

// create a new cart for a user by id
cartRouter.post('/new/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.createCart(req.params.id);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

// deletes cart by user id
cartRouter.delete('/delete/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.deleteCart(req.params.id);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

//add a new product to cart
cartRouter.post('/add/:id/:cartid/:productid/:quantity', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.addNewProductToCart(req.params.id, req.params.cartid, req.params.productid, req.params.quantity);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

//remove a specific product from cart
cartRouter.delete('/remove/:id/:cartid/:productid', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.removeProductFromCart(req.params.id, req.params.cartid, req.params.productid);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

// remove all projeucts from cart
cartRouter.delete('/removeAll/:id/:cartid', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.removeAllCartProducts(req.params.cartid);
        res.json(response);
    } catch (err) {
        next(err);
    }
})

//add one to quantity for a product
cartRouter.put('/addOne/:id/:cartid/:productid', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.changeQuantity(req.params.id, req.params.cartid, req.params.productid, 'plus');
        res.json(response);
    } catch (err) {
        next(err);
    }
});

//minus one from quantity for a product
cartRouter.put('/minusOne/:id/:cartid/:productid', checkAuthorized, async (req, res, next) => {
    try {
        const response = await CartServiceInstance.changeQuantity(req.params.id, req.params.cartid, req.params.productid, 'minus');
        res.json(response);
    } catch (err) {
        next(err);
    }
})

module.exports = cartRouter;