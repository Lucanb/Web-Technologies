const {pool } = require("../../configuration/configApplication");
const homeQuerries = require('./homeFeederQuery')
const {verifChar,verifCharMessage} = require('../../modules/verifChar')
class homeModel {
    constructor() {}

    async updateAnnouncesNews(title, start_date, end_date, topic, author, picture, content) {
        try {
            const { rows } = await pool.query("SELECT * FROM announces WHERE title = $1 LIMIT 1", [title]);

            if (rows.length > 0) {
                const dbRow = rows[0];
                const values = [
                    start_date || dbRow.start_date,
                    end_date || dbRow.end_date,
                    topic || dbRow.topic,
                    author || dbRow.author,
                    picture || dbRow.picture,
                    content || dbRow.content,
                    title
                ];
                const result = await pool.query(homeQuerries.updateAnnouncesQuery, values);
                return result.rows;
            } else {
                console.error('Anuntul cu titlul specificat nu exista în baza de date.');
                throw new Error('Anuntul cu titlul specificat nu exista în baza de date.');
            }
        } catch (error) {
            console.error('Eroare la actualizarea stirilor anuntate:', error);
            throw error;
        }
    }


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

    async DeleteAnnouncesNews(title){
        const values = [title]
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(homeQuerries.deleteAnnounce, values);
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