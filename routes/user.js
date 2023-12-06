const express = require('express');
const jwt = require('jsonwebtoken');
const checkAuthorized = require('../helper/checkAuthorized');
const UserService = require('../services/user');

const UserServiceInstance = new UserService;

const userRouter = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

//register new user
userRouter.post('/register', async (req, res, next) => {
    try {
        const response = await UserServiceInstance.register(req.body);
        
        if(response) {
            
            let secret = process.env.TOKEN_SECRET;
            let token = jwt.sign({id: response.id}, secret, { algorithm: 'HS256', expiresIn: "3600s"});
            res.cookie('jwt_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction ? true : false,
            })
            res.json({ message: 'Successfully Registered', userId: response.id });
        } else {
            //response above is null when the users email they are trying to register is already in the database.
            res.status(400).send();
        }
   
    } catch (err) {
        next(err);
    }
})

// // create new contact details for customer
// userRouter.post('/contact/data/new/:customerId', checkAuthorized, async (req, res, next) => {
//     try {
//         const response = await UserServiceInstance.createContact(req.params.customerId, req.body);
//         res.json(response)
//     } catch (err) {
//         next(err);
//     }
// });

// // amend contact details for customer
// userRouter.put('/contact/data/amend/:customerId', checkAuthorized, async (req, res, next) => {
//     try {
//         const response = await UserServiceInstance.amendContact(req.params.customerId, req.body);
//         res.json(response);
//     } catch (err) {
//         next(err);
//     }
// });

//get user email 
userRouter.get('/data/email/:id', checkAuthorized, async (req, res, next) => {
    try {
        const response = await UserServiceInstance.getCustomerEmail(req.params.id);
        res.json({ message: 'Here is the email associated with your account', response});
    } catch (err) {
        next(err);   
    }
})

// //get all personal data for customer
// userRouter.get('/data/:customerId', checkAuthorized, async (req, res, next) => {
//     try {
//         const response = await UserServiceInstance.getCustomerData(req.params.customerId);
//         res.json(response);
//     } catch (err) {
//         next(err);   
//     }
// })

module.exports = userRouter;