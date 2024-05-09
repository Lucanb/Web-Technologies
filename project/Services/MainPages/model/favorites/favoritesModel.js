const {pool } = require("../../configuration/configApplication");
const favoritesQuerries = require('./favoritesQuery')
const {verifChar,verifCharMessage} = require('../../modules/verifChar')
const {values} = require("pg/lib/native/query");
class favoritesModel {
    constructor() {}

    async addToFavorites(id_user,id_actor,name) {
        try{
            const values = [id_user, id_actor]
            if (verifChar(values)) {
                const {rows} = await pool.query(favoritesQuerries.valid, values);
                if (rows.length === 0) {
                    const values2 = [id_user, id_actor, name];
                    if (verifChar(values2)) {
                        await pool.query(favoritesQuerries.add, [id_user, id_actor, name]);
                    }else {
                        console.error('Eroare la verificarea email-ului', error);
                        throw error;
                    }
                }
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllFavorites(id_user){
        const values = [id_user];
        try{
            if (verifChar(values)) {
                const {rows} = await pool.query(favoritesQuerries.getAll, values);
                return rows;
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTopWeekPicks(){
        const values = [];
        try
        {
            if (verifChar(values)) {
                const {rows} = await pool.query(favoritesQuerries.topPickWeek, values);
                return rows;
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTopFavorites(){
        const values = [];
        try
        {
            if (verifChar(values)) {
                const {rows} = await pool.query(favoritesQuerries.topFavourites, values);
                return rows;
            }else {
                console.error('Eroare la verificarea email-ului', error);
                throw error;
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteActor(id_actor){
        try{
            const values = [id_actor];
            if (verifChar(values)) {
                await pool.query(favoritesQuerries.delete, values);
                return true
            }else {
                console.error('Eroare la verificarea email-ului', error);
                // throw error;
                return false
            }
        }catch (error){
            console.log(error)
            return false
        }
    }
}
module.exports = favoritesModel