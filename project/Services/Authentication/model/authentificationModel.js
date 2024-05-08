const { config, pool } = require("../configuration/configApplication");
const userSQL = require('./userQuery')
const { verifChar, verifToken } = require('../modules/verifChar')
class UserModel
{
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    async emailExists(){
        const values = [this.email]
        try{
            if (verifChar(values)) {
                const {rows} = await pool.query(userSQL.emailExists, values);
                return (rows.length > 0);
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }
    async usernameExists(){
        const values = [this.username]
        try{
            if (verifChar(values)) {
                const {rows} = await pool.query(userSQL.usernameExists, values);
                return (rows.length > 0)
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea username-ului', error);
            throw error;
        }
    }

    async getId() {
        const values = [this.username, this.password]
        try {
            if (verifChar(values)) {
            const {rows} = await pool.query(userSQL.usernameAndPassword, values);
            console.log(rows[0].id)
            return rows[0].id
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error('Eroare la luarea id-ului', error);
            throw error;
        }
    }
    async passwordMatch(){
        const values = [this.username]
        try{
            if (verifChar(values)) {
                const {rows} = await pool.query(userSQL.getHashPassword, values);
                if (rows.length == 0) {
                    return undefined
                } else {
                    // console.log(rows.length)
                    // console.log(JSON.stringify(rows))
                    return [rows[0].id, rows[0].password, rows[0].roles]
                }//incerc sa returnez hash-ul
            }else {
                    console.error('Eroare la verificarea email-ului', error);
                    throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea userului cu parola', error);
            throw error;
        }
    }
    async registerUser(){
        const values = [this.username,this.password,this.email]
        // const usernameExists = await this.usernameExists();
        // const emailExists = await this.emailExists();
        // if (!usernameExists && ! emailExists) {
        try{
            if (verifChar(values)) {
                const {rows} = await pool.query(userSQL.insertUser, values);
                return rows[0];
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error){
            console.error('Eroarea la inregitrarea utilizatorului',error);
            throw error;
        }
        // }else{
        //     console.log('Username or Email already exists!');
        // }
    }
    // async loginUser(){
    //     const values = [this.username, this.password];
    //
    //     try {
    //         const { rows } = await pool.query(userSQL.usernameAndPassword, values);
    //         return (rows.length > 0);
    //     } catch (error) {
    //         console.error('Eroare la autentificarea utilizatorului:', error);
    //         throw error;
    //     }
    // }
    async updateUsername() {
        const values = [this.username];
        try {
            if (verifChar(values)) {
                const result = await pool.query(userSQL.getUserIDAfterEmail, values);
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
            if (result.rowCount === 0) {
                console.error('Nu există un utilizator cu acest username.');
                throw new Error('Nu există un utilizator cu acest username.');
            }
            const rows = result.rows;
            console.log(JSON.stringify(rows[0]))
            const userId = rows[0].id;
            const values2 = [this.username, rows.rows[0].id];
            try {
                if (verifChar(values2)) {
                    await pool.query(userSQL.updateUsername, values2);
                    console.log('Numele de utilizator a fost actualizat cu succes.');
                }else {
                    console.error('Eroare la verificarea email-ului', error);
                    throw error;
                }
            } catch (error) {
                console.error('Eroare la actualizarea numelui de utilizator:', error);
                throw error;
            }
        } catch (error) {
            console.error('Eroare la get ID after username:', error);
            throw error;
        }
    }

    async updatePassword() {
        const values = [this.email];
        if(this.email === undefined)
        {
            console.error('Eroare la parametru:');
            return false
        }
        else
        {
            console.log('this email : ', this.email)
            try {
                if (verifChar(values)) {
                    const result = await pool.query(userSQL.getUserIDAfterEmail, values);
                }else {
                    console.error('Eroare la verificarea email-ului', error);
                    throw error;
                }
                if (result.rowCount === 0) {
                    console.error('Nu există un utilizator cu acest email.');
                    throw new Error('Nu există un utilizator cu acest email.');
                }
                const rows = result.rows
                console.log(JSON.stringify(rows))
                const userId = rows[0].id;
                console.log('id : ',userId)
                const values2 = [this.password, userId];
                try {
                    if (verifChar(values2)) {
                        await pool.query(userSQL.updatePassword, values2);
                        console.log('Parola a fost actualizată cu succes.');
                        return true;
                    }else {
                        console.error('Eroare la verificarea email-ului', error);
                        return false;
                    }
                } catch (error) {
                    console.error('Eroare la actualizarea parolei:', error);
                    throw error;
                }
            } catch (error) {
                console.error('Eroare la get Id after email:', error);
                throw error;
            }
        }
    }
    async addToken(access_token,refresh_token,id)
    {
        const values = [access_token,refresh_token,id]

        try{
            if (verifToken(values)) {
                const {rows} = await pool.query(userSQL.insertToken, values);
                return rows[0];
            }else {
                console.error('Eroare la actualizarea parolei:', error);
                throw error;
            }
        }catch (error){
            console.error('Eroarea la inregitrarea utilizatorului',error);
            throw error;
        }
    }
}

// (async () => {
//     user = new UserModel("ionut", "vara", "ionut@yahoo.com");
//     const exists = await user.usernameExists();
//     console.log(exists);
// })();
module.exports = UserModel;