const { config, pool } = require("../configuration/configApplication");
const adminSQL = require('./adminQuery')
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
            const {rows} = await pool.query(adminSQL.getNominatedActors, values);
            return rows;
        } catch (error) {
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async addAnnounce(startdate,enddate,topic,title,author,picture,content){
        const values = [startdate,enddate,topic,title,author,picture,content]
        try{
            const {rows} = await pool.query(adminSQL.addAnnounces, values);
            return rows;
        }catch (error){
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }
}
module.exports = AdminModel;