const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const favoritesModel = require('../model/favorites/favoritesModel')
const config = require('../configuration/config.js')
const JWToken = require("../modules/token");

class favoritesService{
    constructor() {}

    async add(req,res){
        // const id_user = 1;
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            const data = await new Promise(async (resolve, reject) => {
                req.on('end', () => {
                    try {
                        resolve(querystring.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            const id_actor = data.id;

            console.log(id_actor);
            const decodedIdActor = await JWToken.validate(id_actor);
            const cookies = req.headers.cookie;
            let accessToken = null;
            if (cookies) {
                const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                    const parts = cookie.split('=');
                    acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                    return acc;
                }, {});
                accessToken = cookieObj['accessToken'];
            }
            if (!accessToken) {
                res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                return res.end('Authorization cookie missing or invalid');
            }

            try {
                const decoded = await JWToken.validate(accessToken);
                // if (!decoded) {
                //     res.writeHead(401, {'Content-Type': 'text/html'});
                // }
                console.log('decoded :', decoded[0].userId)
                const id_user = decoded[0].userId;
                try {
                    const model = new favoritesModel();
                    console.log('actor_id : ',decodedIdActor)
                    ///---------------->
                    const apiKey = config.api_key;
                    // const apiUrl = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
                    // const response = await fetch(apiUrl);
                    console.log('actor_id : ',decodedIdActor[0].movieID)
                    const apiUrl = `https://api.themoviedb.org/3/person/${decodedIdActor[0].movieID}?language=en-US&api_key=${apiKey}`;
                    const response = await fetch(apiUrl);
                    // console.log(response);
                    const responseJSON = await response.json()
                    console.log('response sper numele : ',responseJSON)
                    ///---------------->
                    await model.addToFavorites(id_user, decodedIdActor[0].movieID, responseJSON.name);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                } catch (error) {
                    console.error(error);
                    res.status(500).json({error: "Error: add to favorites"});
                }
            } catch (error) {
                console.error(error);
            }
        }catch (error){
            console.log(error)
        }
    }

    async getAllFavorites(req, res) {
        const cookies = req.headers.cookie;
        let accessToken = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            accessToken = cookieObj['accessToken'];
        }
        if (!accessToken) {
            res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            return res.end('Authorization cookie missing or invalid');
        }

        try {
            const decoded = await JWToken.validate(accessToken);
            console.log(decoded)
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            console.log('decoded :', decoded[0].userId)
            const id_user = decoded[0].userId;
            try {
                const model = new favoritesModel();
                console.log('aici crapa?')
                const results = await model.getAllFavorites(id_user);

                // Folosește un loop for pentru a itera prin fiecare element și a aștepta generarea cheii
                for (const element of results) {
                    const actorId = await Token.generateKey({
                        movieID: element.id_actor,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    });
                    element.id_actor = actorId;
                }

                console.log(JSON.stringify(results));
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(results));
            } catch (error) {
                console.error(error);
                res.status(500).json({error: "Error: get all favorites"});
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getTopWeekPicks(req, res) {
        const cookies = req.headers.cookie;
        let accessToken = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            accessToken = cookieObj['accessToken'];
        }
        if (!accessToken) {
            res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            return res.end('Authorization cookie missing or invalid');
        }

        try {
            const decoded = await JWToken.validate(accessToken);
            console.log(decoded)
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            console.log('decoded :', decoded[0].userId)
            const id_user = decoded[0].userId;
            try {
                const model = new favoritesModel();
                const results = await model.getTopWeekPicks();
                console.log('initial results : ', results)
                const resultsWithLinks = [];
                // Folosește un loop for pentru a itera prin fiecare element și a aștepta generarea cheii
                for (const result of results) {

                    const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                    const tmdbResponse = await fetch(url);
                    const tmdbData = await tmdbResponse.json();
                    console.log('tmdbResponse for picks week: ', tmdbData)
                    const profilePath = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].profile_path : null;
                    const id = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].id : null;
                    const actorId = await Token.generateKey({
                        movieID: id,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    })
                    if (profilePath != null) {
                        console.log(`Poster pentru ${result.full_name}: https://image.tmdb.org/t/p/w500/${profilePath}`);
                        resultsWithLinks.push({
                            id: actorId, //astea le codific
                            full_name: result.full_name,
                            posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                        });
                    }
                }
                // console.log('resultsWithLinks : ',JSON.stringify(resultsWithLinks));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(resultsWithLinks))
                res.end()
            } catch (error) {
                console.error(error);
                // res.status(500).json({error: "Error: get all favorites"});
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getTopFavorites(req, res) {
        const cookies = req.headers.cookie;
        let accessToken = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            accessToken = cookieObj['accessToken'];
        }
        if (!accessToken) {
            res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            return res.end('Authorization cookie missing or invalid');
        }

        try {
            const decoded = await JWToken.validate(accessToken);
            console.log(decoded)
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            console.log('decoded :', decoded[0].userId)
            try {
                const model = new favoritesModel();
                const results = await model.getTopFavorites();
                const resultsWithLinks = [];
                // Folosește un loop for pentru a itera prin fiecare element și a aștepta generarea cheii
                for (const result of results) {

                    const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                    const tmdbResponse = await fetch(url);
                    const tmdbData = await tmdbResponse.json();
                    console.log('tmdbResponse for picks week: ', tmdbData)
                    const profilePath = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].profile_path : null;
                    const id = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].id : null;
                    const actorId = await Token.generateKey({
                        movieID: id,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    })
                    if (profilePath != null) {
                        console.log(`Poster pentru ${result.full_name}: https://image.tmdb.org/t/p/w500/${profilePath}`);
                        resultsWithLinks.push({
                            id: actorId,
                            full_name: result.full_name,
                            posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                        });
                    }
                }
                console.log('resultsWithLinks : ',JSON.stringify(resultsWithLinks));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(resultsWithLinks))
                res.end()
            } catch (error) {
                console.error(error);
                // res.status(500).json({error: "Error: get all favorites"});
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = favoritesService;