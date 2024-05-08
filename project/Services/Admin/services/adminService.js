const Token = require("../../Authentication/modules/token");
const config = require('../configuration/config.js')
const AdminModel = require('../model/adminModel')
const querystring = require("querystring");
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

    async getNominated(req,res){
        const adminModel = new AdminModel()
        const results = await adminModel.getNominated()

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(results))
        res.end()
    }

    async addAnnounce(req,res){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        const data = await new Promise((resolve, reject) => {
            req.on('end', () => {
                try {
                    // Parse the string body as JSON
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        });

        console.log(data.start_date);
        console.log(data.end_date);
        console.log(data.topic);
        console.log(data.title);
        console.log(data.author);
        console.log(data.picture);
        console.log(data.content);

        const adminModel = new AdminModel();
        const results = await adminModel.addAnnounce(
            data.start_date,
            data.end_date,
            data.topic,
            data.title,
            data.author,
            data.picture,
            data.content
        );

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: true, results}));
    } catch (error) {
        console.error('Error in addAnnounce:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: false, error: error.message}));
    }
}
module.exports = adminService;
