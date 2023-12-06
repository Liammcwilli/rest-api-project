const { DateTime } = require('luxon');
const pool = require("../db");

class UserModel {
    getDate() {
        return DateTime.now().toISO();
    }
    
    async createLogin(data) {
        try {
            const { email, password, first_name, last_name} = data;
            const newLogin = await pool.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email', [email, password, first_name, last_name]);
            return newLogin.rows[0];
        } catch (err) {
            throw new Error(err);
        }
    }

    async checkExistingEmail(email) {
        try {
            const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return data.rows?.length ? data.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }


    async checkExistingId(id) {
        try {
            const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return data.rows?.length ? data.rows[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    // async checkExistingGoogleId(id) {
    //     try {
    //         const data = await pool.query('SELECT * FROM customers WHERE google_id = $1', [id]);
    //         return data.rows?.length ? data.rows[0] : null;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    // async checkExistingContact(custid) {
    //     try {
    //         const data = await pool.query('SELECT * FROM contacts WHERE id = (SELECT contact_id FROM customers WHERE id = $1)', [custid]);
    //         return data.rows?.length ? data.rows[0] : null;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    // async createContact(data) {
    //     try {
    //         const { address_line1, address_line2, town_city, county, post_code, phone, email} = data;
    //         const newContact = await pool.query('INSERT INTO contacts (address_line1, address_line2, town_city, county, post_code, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [address_line1, address_line2, town_city, county, post_code, phone, email]);
    //         return newContact.rows?.length ? [newContact.rows[0]] : null;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    // async addContactIdForCustomer(custid, contactid) {
    //     try {
    //         await pool.query('UPDATE customers SET contact_id = $2 WHERE id = $1', [custid, contactid]);
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    // async amendContact(custid, data) {
    //     try {
    //         for(const property in data) {
    //             await pool.query(`UPDATE contacts SET ${property} = $1 WHERE id = (SELECT contact_id FROM customers WHERE id = $2)`, [data[property], custid]);
    //         }
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    // async amendLoginData(custid, data) {
    //     try {
    //         for(const property in data) {
    //             await pool.query(`UPDATE customers SET ${property} = $1 WHERE id = $2`, [data[property], custid]);
    //         }
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }

    async getCustomerEmail(id) {
        try {
            const email = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
            if (email.rows && email.rows.length > 0) {
                return email.rows[0].email;
            } else {
                return null; // No matching email found for the given ID
            }
        } catch (err) {
            // Log or handle the error more explicitly
            console.error("Error fetching customer's email:", err.message);
            throw new Error('Error fetching customer email');
        }
    }

    // async getCustomerData(custid) {
    //     try {
    //         const data = await pool.query('SELECT user.id as customer_id, contacts.id as contact_id, payment_id, first_name, last_name, address_line1, address_line2, town_city, county, post_code, phone, customers.email FROM customers JOIN contacts ON customers.contact_id = contacts.id WHERE customers.id = $1', [custid]);
    //         return data.rows?.length ? [data.rows[0]] : null;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }
}

module.exports = UserModel;