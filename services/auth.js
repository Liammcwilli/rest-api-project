const UserModel = require('../models/user');
const { scryptSync, timingSafeEqual} = require('crypto');
const UserService = require('./user');

const UserModelInstance = new UserModel;
const UserServiceInstance = new UserService;

class AuthService {

    async decryptIsMatch(enteredPassword, userPassword) {
        const [salt, key] = userPassword.split(':');
        const hashedBuffer = scryptSync(enteredPassword, salt, 64);
        const keyBuffer = Buffer.from(key, 'hex');
        const match = timingSafeEqual(hashedBuffer, keyBuffer);
        
        if (match) {
            return true;
        } else {
            return false;
        }
    }

    async login(data) {
        try {
            console.log('Checking existing email...');
            const user = await UserModelInstance.checkExistingEmail(data.email);
            let password = user ? user.password : null;

            if (!user || !password) {
                console.log('User or password not found.');
                return null;
            }

            console.log('Decrypting and checking password...');
            const result = await this.decryptIsMatch(data.password, user.password);

            if (result) {
                console.log('Login successful.');
                return user;
            } else {
                console.log('Password does not match.');
                return null;
            }
        } catch (err) {
            console.error('Error in login:', err);
            throw err;
        }
    }


}

module.exports = AuthService;