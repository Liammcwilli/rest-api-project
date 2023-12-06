const ProductModel = require('../models/product');

const ProductModelInstance = new ProductModel;

class ProductService {

    async getProductById(productid) {
        try {
            const data = await ProductModelInstance.getProductById(productid);
            return data;
        } catch (err) {
            throw(err);
        }
    };

    async getAllProducts() {
        try {
            const data = await ProductModelInstance.getAllProducts();
            return data;
        } catch (err) {
            throw(err);
        }
    };


}

module.exports = ProductService;