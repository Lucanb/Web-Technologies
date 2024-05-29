const { config, pool } = require("../configuration/configApplication");
const adminSQL = require('./adminQuery')
const {verifChar,verifPass} = require('../modules/verifChar')
const { parse } = require('csv-parse/sync');


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
        console.log(username)
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

    async updateUsers(username,password,email,lastusername){
        const values = [lastusername]
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.getUserID,values);
                if (rows.length > 0) {
                    const dbRow = rows[0];
                    const values = [
                        username || dbRow.username,
                        password || dbRow.password,
                        email || dbRow.email,
                        dbRow.id
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

    async DeleteAnnouncesNews(title){
        const values = [title]
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(adminSQL.deleteAnnounce, values);
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
                const {rows} = await pool.query(adminSQL.getAnnounces, values);
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

    async updateAnnouncesNews(lasttitle,title, start_date, end_date, topic, author, picture, content) {
        try {
            const { rows } = await pool.query("SELECT * FROM announces WHERE title = $1 LIMIT 1", [lasttitle]);
            console.log(JSON.stringify(rows))
            if (rows.length > 0) {
                const dbRow = rows[0];
                const startDateValue = start_date ? new Date(start_date) : dbRow.start_date;
                const endDateValue = end_date ? new Date(end_date) : dbRow.end_date;

                const values = [
                    startDateValue,
                    endDateValue,
                    topic || dbRow.topic,
                    author || dbRow.author,
                    picture || dbRow.picture,
                    content || dbRow.content,
                    title || dbRow.title,
                    lasttitle
                ];

                const result = await pool.query(adminSQL.updateAnnouncesQuery, values);
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

    async importCsv(csvData) {
        try {
            const records = parse(csvData, {
                columns: false,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true
            });

            await pool.query('BEGIN');

            for (const item of records) {
                if (!Array.isArray(item) || item.length < 5) {
                    console.error('Invalid item format:', item);
                    continue;
                }

                console.log('Processing:', item);
                const [year, category, fullName, show, won] = item.map(field =>
                    field.trim() === '' ? null : field.trim()
                );

                const wonBoolean = (won !== null) ? (won.toLowerCase() === 'true') : null;
                const values = [year, category, fullName, show, wonBoolean]

                await pool.query(
                    adminSQL.insertCsv,
                    values
                );
            }

            await pool.query('COMMIT');
            console.log('CSV data has been successfully uploaded and inserted into the database.');
            return 'CSV data has been successfully uploaded and inserted into the database.';
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Failed to insert CSV data:', error);
            throw error;
        }
    }
}
module.exports = AdminModel;