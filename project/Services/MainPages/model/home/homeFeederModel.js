const {pool } = require("../../configuration/configApplication");
const homeQuerries = require('./homeFeederQuery')
class homeModel {
    constructor() {}

    async getAnnounces() {
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.anouncesQuerry, values);
            return rows
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTopPicks(){
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.topPicksQuery, values);
            return rows
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTodayActors(){
        const values = []

        try {
            const {rows} = await pool.query(homeQuerries.todayActorsQuery, values);
            return rows
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCommingSoon(){
        const values = []
        try {
            const {rows} = await pool.query(homeQuerries.commingSoonQuery, values);
            return rows
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async getAnnouncesNews(){
        const values = []
        try {
            const {rows} = await pool.query(homeQuerries.getAnnounces, values);
            return rows
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
module.exports = homeModel