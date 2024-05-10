const { config, pool } = require("../configuration/configApplication");
const adminSQL = require('./adminQuery')
const {verifChar,verifPass} = require('../modules/verifChar')
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
}
module.exports = AdminModel;