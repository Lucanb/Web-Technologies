const {pool } = require("../../configuration/configApplication");
const actorQuerries = require('./actorQuery')
const {verifChar,verifCharMessage} = require('../../modules/verifChar')
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
            const { rows } = await pool.query(actorQuerries.searchAwardsByName, values);
            return rows.map(row => ({
                year: row.year,
                won: row.won,
                show: row.show
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getNominated() {
        const year = 2020
        const values = [year]
        try {
            if (verifChar(values)) {
                const {rows} = await pool.query(actorQuerries.getNominatedActors, values);
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

}
module.exports = actorModel