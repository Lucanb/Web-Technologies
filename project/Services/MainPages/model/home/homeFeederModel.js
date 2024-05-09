const {pool } = require("../../configuration/configApplication");
const homeQuerries = require('./homeFeederQuery')
const {verifChar,verifCharMessage} = require('../../modules/verifChar')
class homeModel {
    constructor() {}

    async getAnnounces() {
        const values = []

        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.anouncesQuerry, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTopPicks(){
        const values = []

        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.topPicksQuery, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTodayActors(){
        const values = []

        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.todayActorsQuery, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCommingSoon(){
        const values = []
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.commingSoonQuery, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async getAnnouncesNews(){
        const values = []
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.getAnnounces, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addHelpItem(content,email){
        const values = [content,email]
        try {
            if (verifCharMessage(values)) {
                const {rows} = await pool.query(homeQuerries.addHelp, values);
                return rows
            }else {
                console.error('Eroare la verificarea email-ului');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
module.exports = homeModel