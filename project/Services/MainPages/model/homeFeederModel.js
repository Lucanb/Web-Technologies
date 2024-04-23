
const { config, pool } = require("../configuration/configApplication");
const homeQuerries = require('./homeFeederQuery')
const {JS} = require("follow/lib");
class UserModel {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    async getAnnounces() {
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.anouncesQuerry, values);
            return rows
        } catch (error) {
            console.error('Eroare la returnearea datelor din homeFeederQuery', error);
            throw error;
        }
    }

    async getTopPicks(){
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.topPicksQuery, values);
            return rows
        } catch (error) {
            console.error('Eroare la returnearea datelor din getTopPicks', error);
            throw error;
        }
    }

    async getTodayActors(){
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.todayActorsQuery, values);
            return rows
        } catch (error) {
            console.error('Eroare la returnearea datelor din getTodayActors', error);
            throw error;
        }
    }

    async getCommingSoon(){
        const values = []
        try {
            const {rows} = await pool.query(homeQuerries.commingSoonQuery, values);
            return rows
        } catch (error) {
            console.error('Eroare la returnearea datelor din getCommingSoon', error);
            throw error;
        }

    }
}
module.exports = UserModel