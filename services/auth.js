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
            const user = await UserModelInstance.checkExistingEmail(data.email);
            let password = user ? user.password : null
            if (!user || !password) return null;
            const result = await this.decryptIsMatch(data.password, user.password)
            return result ? user : null;
        } catch (err) {
            throw(err);
        }
    }

    async changePassword(custid, data) {
        try {
            const user = await UserModelInstance.checkExistingId(custid);
            const match = this.decryptIsMatch(data.current_password, user.password);
            if(match) {
                const encryptedPassword = await UserServiceInstance.encrypt(data.new_password);
                const newData = { password: encryptedPassword }
                await UserModelInstance.amendLoginData(custid, newData);
                return true;
            } else {
                return null;
            }
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = AuthService;