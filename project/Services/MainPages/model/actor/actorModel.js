const {pool } = require("../../configuration/configApplication");
const actorQuerries = require('./actorQuery')
const {verifChar,verifCharMessage} = require('../../modules/verifChar')
const {values} = require("pg/lib/native/query");
class actorModel {
    constructor() {}

    async searchByName(full_name){
        const values = [full_name];
        try
        {
            if (verifChar(values)) {
                const {rows} = await pool.query(actorQuerries.searchByName, values);
                return rows;
            }else {
                console.error(error);
                throw error;
            }
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    async searchAwardsByName(full_name) {
        const values = [full_name];
        try {
            if (verifChar(values)) {
                const { rows } = await pool.query(actorQuerries.searchAwardsByName, values);
                return rows.map(row => ({
                    year: row.year,
                    won: row.won,
                    show: row.show
                }));
            } else {
                console.error(error);
                throw error;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
module.exports = actorModel