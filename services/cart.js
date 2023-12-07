const CartModel = require('../models/cart');


const CartModelInstance = new CartModel;

class CartService {

    // create cart by id
    async createCart(id) {
        try {
            console.log('Checking existing cart...');
            const cart = await CartModelInstance.checkExistingCart(id);
            if (cart) {
                console.log('Cart already exists.');
                return cart;
            }
            console.log('Creating new cart...');
            const newCart = await CartModelInstance.createCart(id);
            console.log('New cart created.');
            return newCart;
        } catch (err) {
            console.error('Error in createCart:', err);
            throw err;
        }
    } 

    async checkCart(id) {
        try {
            console.log('Checking cart by ID...');
            const cart = await CartModelInstance.checkExistingCart(id);
            if (!cart) {
                console.log('Cart not found.');
                return null;
            }
            console.log('Cart found.');
            return cart;
        } catch (err) {
            console.error('Error in checkCart:', err);
            throw err;
        }
    }

    async checkProduct(id, productid) {
        try {
            console.log('Checking product in cart...');
            const product = await CartModelInstance.checkExistingProductInCart(id, productid);
            if (!product) {
                console.log('Product not found in cart.');
                return null;
            }
            console.log('Product found in cart.');
            return true;
        } catch (err) {
            console.error('Error in checkProduct:', err);
            throw err;
        }
    }



    // adds new product to the cart
    async addNewProductToCart(id, cartid, productid, quantity) {
        try {
            if (!this.checkCart(id) || !this.checkProduct(id, productid)) {
                console.log('Cart or Product does not exist');
                return null;
            }
    
            await CartModelInstance.addNewProductToCart(id, cartid, productid, quantity);
            console.log('Product added to the cart');
    
            try {
                await CartModelInstance.updateTotalCost(cartid, id);
                console.log('Total cost updated');
    
                const cartProducts = await CartModelInstance.getAllProductsFromCart(cartid);
                console.log('All products in the cart:', cartProducts);
                return cartProducts;
            } catch (updateError) {
                console.log('Error updating total cost:', updateError);
                throw updateError;
            }
        } catch (err) {
            throw err;
        }
    }
    
    

    async deleteCart(id) {
        try {
            if (!await this.checkCart(id)) {
                console.log('Cart does not exist');
                return null;
            }
    
            await CartModelInstance.deleteCart(id);
            console.log('Cart deleted');
    
            const data = await CartModelInstance.checkExistingCart(id);
            console.log('Cart existence after deletion:', data);
    
            if (!data) {
                console.log('Cart successfully deleted');
                return true;
            } else {
                console.log('Cart deletion failed');
                return false;
            }
        } catch (err) {
            throw err;
        }
    }
    
    async removeProductFromCart(id, cartid, productid) {
        try {
            if (!this.checkCart(id) || !this.checkProduct(id, productid)) return null;
            await CartModelInstance.removeProductFromCart(id, cartid, productid);
            console.log('Product deleted from cart');
    
            await CartModelInstance.updateTotalCost(cartid);
            console.log('Total cost updated');
    
            const data = await CartModelInstance.checkExistingProductInCart(id, productid);
            if (!data) {
                const cartProducts = await CartModelInstance.getAllProductsFromCart(cartid);
                console.log('Product not found in cart');
                return cartProducts;
            } else {
                console.log('Product still exists in cart');
                return data;
            }
        } catch (err) {
            throw err;
        }
    }

    async removeAllCartProducts(cartid) {
        try {
            console.log('Removing all products from the cart...');
            await CartModelInstance.removeAllProductsFromCart(cartid);
            console.log('All products removed from the cart.');
    
            console.log('Updating total cost...');
            await CartModelInstance.updateTotalCost(cartid);
            console.log('Total cost updated.');
    
            console.log('Fetching all products from the cart...');
            const data = await CartModelInstance.getAllProductsFromCart(cartid);
            console.log('All products in the cart:', data);
    
            return data;
        } catch (err) {
            throw(err);
        }
    }
    
    async changeQuantity(id, cartid, productid, plusOrMinus) {
        try {
            console.log('Changing product quantity in cart...');
            let product;
            if (!this.checkCart(id) || !this.checkProduct(id, productid)) {
                console.log('Cart or product does not exist.');
                return null;
            }
            if (plusOrMinus === 'plus') {
                console.log('Increasing product quantity in cart...');
                product = await CartModelInstance.addOneProduct(cartid, productid);
            } else if (plusOrMinus === 'minus') {
                console.log('Decreasing product quantity in cart...');
                product = await CartModelInstance.minusOneProduct(cartid, productid);
            } else {
                console.log('No operation specified.');
                return;
            }
            if (product) {
                console.log('Updating total cost...');
                await CartModelInstance.updateTotalCost(cartid);
            }
            console.log('Fetching all products from cart...');
            const cartProducts = await CartModelInstance.getAllProductsFromCart(cartid);
            console.log('Products in cart retrieved successfully.');
            return cartProducts;
        } catch (err) {
            console.error('Error in changeQuantity:', err);
            throw err;
        }
    }
    
}

module.exports = CartService;