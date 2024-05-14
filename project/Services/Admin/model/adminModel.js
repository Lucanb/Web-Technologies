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
        const values = [username,password,email,username]
        try{
            if (verifPass(values)) {
                const {rows} = await pool.query(adminSQL.getUserID,[lastusername]);
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

}
module.exports = AdminModel;