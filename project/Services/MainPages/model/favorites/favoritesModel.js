const {pool } = require("../../configuration/configApplication");
const favoritesQuerries = require('./favoritesQuery')
class favoritesModel {
    constructor() {}

    async addToFavorites(id_user,id_actor) {
        try{
            const {rows} = await pool.query(favoritesQuerries.valid, [id_user,id_actor]);
            if(rows.length === 0){
                await pool.query(favoritesQuerries.add,[id_user,id_actor]);
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
}
module.exports = favoritesModel