const express = require('express');

const ProductService = require('../services/product');

const ProductServiceInstance = new ProductService;

const productRouter = express.Router();

//get product by id
productRouter.get('/:productid', async (req, res, next) => {
    try {
        const response = await ProductServiceInstance.getProductById(req.params.productid);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

//get all products
productRouter.get('/', async (req, res, next) => {
    try {
        const response = await ProductServiceInstance.getAllProducts();
        res.json(response);
    } catch (err) {
        next(err);
    }
});







module.exports = productRouter;