const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const config = require('../configuration/config.js')
const {json} = require("../../../modules/middlewares/bodyParser");
const JWToken = require("../modules/token");

class actorService {
    constructor() {
    }

    async info(req, res) {
        try {
            let body= '';
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
               const id = data.id;
                if(id != undefined) {
                   return id;
                }
                else return null;
            /*
                const apiKey = config.api_key;
                const apiUrl = `https://api.themoviedb.org/3/person/${id}?language=en-US&api_key=${apiKey}`;
                const response = await axios.get(apiUrl);

                if (response.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }
                if (response.data.name != null) {
                    const apiKey = config.api_key;
                    const apiUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&query=${response.data.name}&api_key=${apiKey}`;
                    const new_response = await axios.get(apiUrl);

                    if (new_response.status !== 200) {
                        throw new Error('Nu am putut obține informațiile despre actor.');
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                const json = {
                        success: true,
                        data: new_response.data
                    }
                    res.write(JSON.stringify(json))
                    res.end()
                } else {
                    console.error('Eroare interna la ruta - ales nasol');
                }*/
        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
        }
    }

    async infoId(req, res) {
        try {
            let body= '';
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
            const id = data.id;
            const decoded = await JWToken.validate(id);
            const actor_id = decoded[0].movieID;
            const apiKey = config.api_key;
                // const apiUrl = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
                // const response = await fetch(apiUrl);
            const apiUrl = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
            const response = await fetch(apiUrl);
            const responseJSON = await response.json()

                if (response.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }
            if (responseJSON.name != null) {
                const apiKey = config.api_key;
                const apiUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&query=${responseJSON.name}&api_key=${apiKey}`;
                // const initialResponse = await axios.get(apiUrl);
                const initialResponse = await fetch(apiUrl);
                const initialResponseJSON = await initialResponse.json()
                if (initialResponse.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }

                // const totalPages = initialResponse.data.total_pages;
                // const results = initialResponse.data.results;

                const totalPages = initialResponseJSON.total_pages;
                const results = initialResponseJSON.results;

                // Stocăm toate rezultatele într-un array
                let allResults = [...results];

                // Parcurgem restul paginilor și adăugăm rezultatele în array-ul nostru
                for (let page = 2; page <= totalPages; page++) {
                    const nextPageUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=${page}&query=${responseJSON.name}&api_key=${apiKey}`;
                    const nextPageResponse = await fetch(nextPageUrl);
                    const nextPageResponseJSON = nextPageResponse.json()
                    if (nextPageResponse.status !== 200) {
                        throw new Error('Nu am putut obține informațiile despre actor.');
                    }
                    allResults = [...allResults, ...nextPageResponseJSON.results];
                }

                const formattedResponse = {
                    success: true,
                    data: allResults.map(result => ({
                        id: result.id,
                        known_for_department: result.known_for_department,
                        name: result.name,
                        original_name: result.original_name,
                        profile_path: `https://image.tmdb.org/t/p/w500${result.profile_path}`,
                        known_for: result.known_for.map(knownForItem => ({
                            id: knownForItem.id,
                            overview: knownForItem.overview,
                            poster_path: `https://image.tmdb.org/t/p/w500${knownForItem.poster_path}`,
                            title: knownForItem.title ? knownForItem.title : knownForItem.name,
                            vote_average: knownForItem.vote_average
                        }))
                    }))
                };
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(formattedResponse));
                res.end();
            }
            else {
                    console.error('Eroare interna la ruta - ales nasol');
                }
        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
        }
    }


}

module.exports = actorService;