const CartModel = require('../models/cart');


const CartModelInstance = new CartModel;

class CartService {

    // create cart by id
    async createCart(id) {
        try {
            const cart = await CartModelInstance.checkExistingCart(id);
            if (cart) return cart;
            const newCart = await CartModelInstance.createCart(id);
            return newCart;
        } catch (err) {
            throw(err);
        }
    } 
    // check cart by id
    async checkCart(id) {
        try {
            const cart = await CartModelInstance.checkExistingCart(id);
            if (!cart) return null;
            return cart;
        } catch (err) {
            throw(err);
        }
    }

    // checks 
    async checkProduct(id, productid) {
        try {
            const product = await CartModelInstance.checkExistingProductInCart(id, productid);
            if (!product) return null;
            return true;
        } catch (err) {
            throw(err);
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
            let product;
            if(!this.checkCart(id) || !this.checkProduct(id, productid)) return null;
            if (plusOrMinus === 'plus') {
                product = await CartModelInstance.addOneProduct(cartid, productid);
            } else if (plusOrMinus === 'minus') {
                product = await CartModelInstance.minusOneProduct(cartid, productid);
            } else {
                return;
            }
            if(product) await CartModelInstance.updateTotalCost(cartid);
            const cartProducts = await CartModelInstance.getAllProductsFromCart(cartid);
            return cartProducts;
            
        } catch (err) {
            throw(err);
        }
    }
    
}

module.exports = CartService;