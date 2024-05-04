const {pool } = require("../../configuration/configApplication");
const favoritesQuerries = require('./favoritesQuery')
class favoritesModel {
    constructor() {}

    async addToFavorites(id_user,id_actor,name) {
        try{
            const {rows} = await pool.query(favoritesQuerries.valid, [id_user,id_actor]);
            if(rows.length === 0){
                await pool.query(favoritesQuerries.add,[id_user,id_actor,name]);
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllFavorites(id_user){
        try{
            const {rows} = await pool.query(favoritesQuerries.getAll, [id_user]);
            return rows;
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTopWeekPicks(){
        try
        {
            const {rows} = await pool.query(favoritesQuerries.topPickWeek);
            console.log('----------')
            console.log(JSON.stringify(rows))
            console.log('----------')
            return rows;
        }catch (error) {
            console.error(error);
            throw error;
        }
    }
}
module.exports = favoritesModel