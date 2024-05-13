const { config, pool } = require("../configuration/configApplication");
const adminSQL = require('./adminQuery')
const {verifChar,verifPass} = require('../modules/verifChar')
const homeQuerries = require("../../MainPages/model/home/homeFeederQuery");
class AdminModel {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    async getNominated() {
        const year = 2020
        const values = [year]
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(adminSQL.getNominatedActors, values);
                return rows;
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        } catch (error) {
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async addAnnounce(startdate,enddate,topic,title,author,picture,content){
        const values = [startdate,enddate,topic,title,author,picture,content]
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.addAnnounces, values);
                return rows;
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async getUsers(){
        const values = []
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.getUsers, values);
                return rows;
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async deleteUsers(username){
        const values = [username]
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.deleteUsers, values);
                return rows;
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async addUsers(username,password,email){
        const values = [username,password,email]

        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.addUser, values);
                return rows;
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async updateUsers(username,password,email){
        const values = [username,password,email,username]
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.getUsers, values);
                if (rows.length > 0) {
                    const dbRow = rows[0];
                    const values = [
                        username || dbRow.username,
                        password || dbRow.password,
                        email || dbRow.email,
                        username || dbRow.username
                    ];
                    const result = await pool.query(adminSQL.updateUser, values);
                    return rows;
                }else{
                    console.error('Utilizator inexistent',error);
                    throw error;
                }
            }else {
                console.error('Folositi doar caractere normale', error);
                throw error;
            }
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

}
module.exports = AdminModel;