const ProductModel = require('../models/product');

const ProductModelInstance = new ProductModel;

class ProductService {

    async getProductById(productid) {
        try {
            console.log('Fetching product by ID...');
            const data = await ProductModelInstance.getProductById(productid);
            console.log('Product data retrieved successfully.');
            return data;
        } catch (err) {
            console.error('Error in getProductById:', err);
            throw err;
        }
    };

    async getAllProducts() {
        try {
            console.log('Fetching all products...');
            const data = await ProductModelInstance.getAllProducts();
            console.log('All products retrieved successfully.');
            return data;
        } catch (err) {
            console.error('Error in getAllProducts:', err);
            throw err;
        }
    }


}

module.exports = ProductService;