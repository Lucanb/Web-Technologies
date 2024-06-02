const querystring = require("querystring");
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
                const id_user = decoded[0].userId;
                try {
                    const model = new favoritesModel();
                    ///---------------->
                    const apiKey = config.api_key;
                    // const apiUrl = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
                    // const response = await fetch(apiUrl);
                    const apiUrl = `https://api.themoviedb.org/3/person/${decodedIdActor[0].movieID}?language=en-US&api_key=${apiKey}`;
                    const response = await fetch(apiUrl);
                    const responseJSON = await response.json()
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
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            const id_user = decoded[0].userId;
            try {
                const model = new favoritesModel();
                const results = await model.getAllFavorites(id_user);

                for (const element of results) {
                    const actorId = await JWToken.generateKey({
                        movieID: element.id_actor,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    });
                    element.id_actor = actorId;
                }

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
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            const id_user = decoded[0].userId;
            try {
                const model = new favoritesModel();
                const results = await model.getTopWeekPicks();
                const resultsWithLinks = [];
                // Folosește un loop for pentru a itera prin fiecare element și a aștepta generarea cheii
                for (const result of results) {

                    const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                    const tmdbResponse = await fetch(url);
                    const tmdbData = await tmdbResponse.json();
                    const profilePath = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].profile_path : null;
                    const id = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].id : null;
                    const actorId = await JWToken.generateKey({
                        movieID: id,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    })
                    if (profilePath != null) {
                        resultsWithLinks.push({
                            id: actorId, //astea le codific
                            full_name: result.full_name,
                            posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                        });
                    }
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(resultsWithLinks))
                res.end()
            } catch (error) {
                console.error(error);
                res.status(500).json({error: "Error: get all favorites"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Error: get all favorites"});
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
            // if (!decoded) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            // }
            try {
                const model = new favoritesModel();
                const results = await model.getTopFavorites();
                const resultsWithLinks = [];
                // Folosește un loop for pentru a itera prin fiecare element și a aștepta generarea cheii
                for (const result of results) {

                    const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                    const tmdbResponse = await fetch(url);
                    const tmdbData = await tmdbResponse.json();
                    const profilePath = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].profile_path : null;
                    const id = tmdbData.results && tmdbData.results.length > 0 ? tmdbData.results[0].id : null;
                    const actorId = await JWToken.generateKey({
                        movieID: id,
                        fresh: true,
                        type: 'access'
                    }, {
                        expiresIn: '1h'
                    })
                    if (profilePath != null) {
                        resultsWithLinks.push({
                            id: actorId,
                            full_name: result.full_name,
                            posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                        });
                    }
                }
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


    async deleteFavorites(req, res) {
        const id = req.headers['id'];
        const decoded = await JWToken.validate(id)
        const actor_id = decoded[0].movieID
        try {
                const model = new favoritesModel();
                const results = await model.deleteActor(actor_id);
                if(results)
                {//res.write(JSON.stringify(resultsWithLinks))
                 console.log('Deleted successfull')
                 res.end()
                }else {
                    console.log('Deleted unsuccessfull')
                    res.end()
                }
            } catch (error) {
                console.error(error);
            }

    }
}

module.exports = favoritesService;