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
            const user = await UserModelInstance.checkExistingEmail(data.email);
            if (!user) {
                const encryptedPassword = this.encrypt(data.password);
                const newData = {...data, password: await encryptedPassword}
                const loginData = await UserModelInstance.createLogin(newData);
                return loginData;
            } else {
                return null;
            }
            
        } catch (err) {
            throw(err);
        }
    }

    async googleLoginRegister(data) {
        try {
            const user = await UserModelInstance.checkExistingGoogleId(data.google_id);
            if(user) {
                return user;
            } else {
                const newUser = await UserModelInstance.createLogin(data);
                return newUser;
            }
        } catch (err) {
            throw(err)
        }
    }

    async createContact(custid, data) {
        try {
            const contactData = await UserModelInstance.createContact(data);
            await UserModelInstance.addContactIdForCustomer(custid, contactData[0].id);
            return contactData;
            
        } catch (err) {
            throw(err);
        }
    }

    async amendContact(custid, data) {
        try {
            const contactData = await UserModelInstance.checkExistingContact(custid);
            if (!contactData) return null;
            await UserModelInstance.amendContact(custid, data);
            const custData = await UserModelInstance.getCustomerData(custid);
            return custData;
            
        } catch (err) {
            throw(err);
        }
    }
    
    async getCustomerEmail(id) {
        try {
            const data = UserModelInstance.getCustomerEmail(id);
            return data;
        } catch (err) {
            throw(err);
        }
    }

    async getCustomerData(custid) {
        try {
            const data = UserModelInstance.getCustomerData(custid);
            return data;
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = UserService;