const Token = require("../../Authentication/modules/token");
const config = require('../configuration/config.js')

class adminService {
    constructor() {
    }

    async announces(req, res) {

        const feederModel = new homeFeederModel()
        const results = await feederModel.getAnnounces()
        const resultsWithLinks = [];
        for (const result of results) {
            try {
                const url = `https://api.themoviedb.org/3/search/multi?api_key=${config.api_key}&query=${result.show}`;
                const tmdbResponse = await fetch(url);
                const tmdbData = await tmdbResponse.json();
                const posterPath = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].poster_path : null;
                const id = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].id : null;
                const movieToken = await Token.generateKey({
                    movieID: id,
                    fresh: true,
                    type: 'access'
                }, {
                    expiresIn: '1h'
                })
                if (posterPath != null) {
                    resultsWithLinks.push({
                        id: movieToken,
                        show: result.show,
                        posterUrl: `https://image.tmdb.org/t/p/w500${posterPath}`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }


}
module.exports = homeService;
