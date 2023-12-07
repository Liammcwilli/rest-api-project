const { scryptSync, randomBytes } = require('crypto');
const UserModel = require('../models/user');

const UserModelInstance = new UserModel;

class UserService {
    
    async encrypt(password) {
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = scryptSync(password, salt, 64).toString('hex');
        const passwordEncrypted = `${salt}:${hashedPassword}`;
        return passwordEncrypted;
        //need to await this as returns promise
    }

    async register(data) {
        try {
            console.log('Checking existing user...');
            const user = await UserModelInstance.checkExistingEmail(data.email);
            if (!user) {
                console.log('User not found. Encrypting password...');
                const encryptedPassword = await this.encrypt(data.password);
                console.log('Creating new user...');
                const newData = {...data, password: encryptedPassword}
                const loginData = await UserModelInstance.createLogin(newData);
                return loginData;
            } else {
                console.log('User already exists.');
                return null;
            }
            
        } catch (err) {
            console.error('Error in register:', err);
            throw err;
        }
    }

    
    async getCustomerEmail(id) {
        try {
            console.log('Fetching customer email...');
            const data = UserModelInstance.getCustomerEmail(id);
            return data;
        } catch (err) {
            console.error('Error in getCustomerEmail:', err);
            throw err;
        }
    }


}

module.exports = UserService;