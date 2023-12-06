const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const checkAuthorized = require('../helper/checkAuthorized');
const UserService = require('../services/user');
const AuthService = require('../services/auth');


const AuthServiceInstance = new AuthService;
const UserServiceInstance = new UserService;

const authRouter = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

//customer login
authRouter.post('/login', async (req, res, next) => {
    try {
        const response = await AuthServiceInstance.login(req.body);
        if(response) {
            let secret = process.env.TOKEN_SECRET;
            let token = jwt.sign({id: response.id}, secret, { algorithm: 'HS256', expiresIn: "3600s"});
            res.cookie('jwt_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction ? true : false,
            })
            res.json({ message: 'Successfully logged in', userId: response.id });
        } else {
            res.status(401).send();
        }
    } catch (err) {
        next(err);
    }
});


//customer logout
authRouter.post('/logout', (req, res, next) => {
    res.clearCookie('jwt_token').status(200).json({ message: 'Successfully logged out' });
});

module.exports = authRouter;