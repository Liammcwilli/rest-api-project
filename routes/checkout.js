const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const checkAuthorized = require('../helper/checkAuthorized');

const checkoutRouter = express.Router();

const isProduction = process.env.NODE_ENV === 'production';
const url = isProduction ? process.env.CLIENT_URL : 'http://localhost:3000';

checkoutRouter.post('/:customerId', checkAuthorized, async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.body.email,
            line_items: req.body.products.map(product => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: parseFloat(product.price_per_unit)*100    
                },
                quantity: product.quantity
            })),
            success_url: `${url}/checkout-success`,
            cancel_url: `${url}/basket`
        });
        res.json({ url: session.url })
    } catch (err) {
        next(err)
    }
})



module.exports = checkoutRouter;