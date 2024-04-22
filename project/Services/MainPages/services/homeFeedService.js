const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const homeFeederModel = require('../model/homeFeederModel')

class homeService {
    constructor() {
    }

    async announces(req,res){

        const feederModel = new homeFeederModel()
        const results = await  feederModel.getAnnounces()
        const resultsWithLinks = [];
        console.log(results)
        for (const result of results) {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
                    params: {
                        api_key: '7a6d358a66d1a4659ce26e0a44d4895e',
                        query: result.show,
                    }
                });

                const posterPath = tmdbResponse.data.results[0].poster_path;
                console.log(`Poster pentru ${result.show}: https://image.tmdb.org/t/p/w500${posterPath}`);
                resultsWithLinks.push({
                    show: result.show,
                    posterUrl: `https://image.tmdb.org/t/p/w500${posterPath}`
                });
            } catch (error) {
                console.error(error);
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }

}

module.exports = homeService;
