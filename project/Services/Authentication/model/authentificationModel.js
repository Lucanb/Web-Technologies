const { config, pool } = require("../configuration/configApplication");
const userSQL = require('./userQuery')
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
            const { rows } = await pool.query(userSQL.emailExists, values);
            return (rows.length > 0);
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }
    async usernameExists(){
        const values = [this.username]
        try{
            const { rows } = await pool.query(userSQL.usernameExists, values);
            return (rows.length > 0)
        }catch (error){
            console.error('Eroare la verificarea username-ului', error);
            throw error;
        }
    }

    async getId() {
        const values = [this.username, this.password]
        try {
            const {rows} = await pool.query(userSQL.usernameAndPassword, values);
            console.log(rows[0].id)
            return rows[0].id
        } catch (error) {
            console.error('Eroare la luarea id-ului', error);
            throw error;
        }
    }
    async passwordMatch(){
        const values = [this.username]
        try{
            const { rows } = await pool.query(userSQL.getHashPassword, values);
            if (rows.length == 0) {
                return undefined
            }else {
                // console.log(rows.length)
                // console.log(JSON.stringify(rows))
                return [rows[0].id, rows[0].password]
            }//incerc sa returnez hash-ul
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
                const { rows } = await pool.query(userSQL.insertUser,values);
                return rows[0];
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
    async updateUsername(id, newUsername) {
        const values = [newUsername, id];

        try {
            await pool.query(userSQL.updateUsername, values);
            console.log('Numele de utilizator a fost actualizat cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea numelui de utilizator:', error);
            throw error;
        }
    }

    async updatePassword(id, newPassword) {
        const values = [newPassword, id];

        try {
            await pool.query(userSQL.updatePassword, values);
            console.log('Parola a fost actualizată cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea parolei:', error);
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