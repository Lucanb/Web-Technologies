const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const config = require('../configuration/config.js')
const {json} = require("../../../modules/middlewares/bodyParser");
const homeModel = require("../model/home/homeFeederModel")
const JWToken = require("../modules/token");
const {rows} = require("pg/lib/defaults");
const actorModel = require('../model/actor/actorModel')
const {get} = require("http");
const AdminModel = require("../../Admin/model/adminModel");

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
            const apiUrl = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
            const response = await fetch(apiUrl);
            const responseJSON = await response.json()

                if (response.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }
            if (responseJSON.name != null) {
                const apiKey = config.api_key;
                const apiUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&query=${responseJSON.name}&api_key=${apiKey}`;
                const initialResponse = await fetch(apiUrl);
                const initialResponseJSON = await initialResponse.json()
                if (initialResponse.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }
                const totalPages = initialResponseJSON.total_pages;
                const results = initialResponseJSON.results;
                let allResults = [...results];
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

    async getNotifications(req, res) {
        try {
                const announceModel = new homeModel();
                const rows = await announceModel.getAnnouncesNews()
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(rows));
                res.end();
        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
            res.end(error)
        }
    }

    async search(req, res) {
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
            const full_name = data.full_name;
            console.log(full_name)
            const actor = new actorModel();
            const rows = await actor.searchByName(full_name);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(rows));
            res.end();

        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
            res.end(error)
        }
    }

    async statisticGenre(req,res){
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
            });
            const id = data.id;
            const decoded = await JWToken.validate(id);
            const actor_id = decoded[0].movieID;
            const apiKey = config.api_key;
            const url = `https://api.themoviedb.org/3/person/${actor_id}/combined_credits?language=en-US&api_key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error');
            }

            const responseJSON = await response.json();
            const genreIds = [...new Set(responseJSON.cast.flatMap(item => item.genre_ids))];
            const genreMap = {};

            for (const genreId of genreIds) {
                const urlGenre = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${apiKey}`;
                const responseGenre = await fetch(urlGenre);

                if (!responseGenre.ok) {
                    throw new Error('Error');
                }

                const responseGenreJSON = await responseGenre.json();
                const genreObject = responseGenreJSON.genres.find(genre => genre.id === genreId);
                const genreName = genreObject ? genreObject.name : "Unknown Genre";

                genreMap[genreName] = responseJSON.cast.filter(item =>
                    item.genre_ids.includes(genreId)).map(item =>
                    item.original_title);
            }
            console.log(genreMap)
            return genreMap;
        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
            res.end(error)
        }
    }

    async statisticAwards(req,res){
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
            });
            const id = data.id;
            const decoded = await JWToken.validate(id);
            const actor_id = decoded[0].movieID;
            const apiKey = config.api_key;
            const url = `https://api.themoviedb.org/3/person/${actor_id}?language=en-US&api_key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error');
            }

            const responseJSON = await response.json();
            const full_name = responseJSON.name;
            const actor = new actorModel();
            const awards = await actor.searchAwardsByName(full_name);
            const awardsByYear = new Map();

            awards.forEach(award => {
                const year = award.year.substring(0, 4);
                if (!awardsByYear.has(year)) {
                    awardsByYear.set(year, {
                        won: 0,
                        shows: []
                    });
                }

                const current = awardsByYear.get(year);
                if (award.won){
                    current.won++;
                    current.shows.push(award.show);
                    awardsByYear.set(year,current);
                }
                else{
                    current.shows.push(award.show);
                    awardsByYear.set(year,current);
                }
            });

            const awardsYearObject = Object.assign({}, ...Array.from(awardsByYear.entries())
                .map(([key, value]) => ({ [key]: value })));
            return awardsYearObject

        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
            res.end(error)
        }
    }

    async getNominated(req,res){
        const actor = new actorModel()
        const results = await actor.getNominated()

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(results))
        res.end()
    }
}

module.exports = actorService;