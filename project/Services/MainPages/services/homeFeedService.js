const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const homeFeederModel = require('../model/home/homeFeederModel')
const config = require('../configuration/config.js')

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
                        api_key: config.api_key,
                        query: result.show,
                    }
                });

                const posterPath = tmdbResponse.data.results[0].poster_path;
                const id = tmdbResponse.data.results[0].id;
                const movieToken = await Token.generateKey({
                    movieID: id,
                    fresh: true,
                    type: 'access'
                }, {
                    expiresIn: '1h'
                })
                if(posterPath != null) {
                    console.log(`Poster pentru ${result.show}: https://image.tmdb.org/t/p/w500${posterPath}`);
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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }

    async topPicks(req,res){
        const feederModel = new homeFeederModel()
        const results = await  feederModel.getTopPicks()
        const resultsWithLinks = [];
        console.log(results)
        for (const result of results) {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`, {
                    params: {
                        api_key: config.api_key,
                        query: result.full_name,
                    }
                });
                const profilePath = tmdbResponse.data.results[0].profile_path;
                const id = tmdbResponse.data.results[0].id;
                if(profilePath != null) {
                    console.log(`Poster pentru ${result.full_name}: https://image.tmdb.org/t/p/w500/${profilePath}`);
                    resultsWithLinks.push({
                        id: id,
                        full_name: result.full_name,
                        posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }

    async todayActors(req,res){
        const feederModel = new homeFeederModel()
        const results = await  feederModel.getTodayActors()
        console.log(results)
        const resultsWithLinks = [];
        console.log(results)
        for (const result of results) {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`, {
                    params: {
                        api_key: config.api_key,
                        query: result.full_name,
                    }
                });
                const profilePath = tmdbResponse.data.results[0].profile_path;
                const id = tmdbResponse.data.results[0].id;
                if(profilePath != null) {
                    console.log(`Poster pentru ${result.full_name}: https://image.tmdb.org/t/p/w500/${profilePath}`);
                    resultsWithLinks.push({
                        id: id,
                        full_name: result.full_name,
                        posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }

    async commingSoon(req,res){

        const feederModel = new homeFeederModel()
        const results = await  feederModel.getCommingSoon()
        const resultsWithLinks = [];
        console.log(results)
        for (const result of results) {
            try {
                const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
                    params: {
                        api_key: config.api_key,
                        query: result.show,
                    }
                });

                const posterPath = tmdbResponse.data.results[0].poster_path;
                const id = tmdbResponse.data.results[0].id;
                const movieToken = await Token.generateKey({
                    movieID: id,
                    fresh: true,
                    type: 'access'
                }, {
                    expiresIn: '1h'
                })
                if(posterPath != null) {
                    console.log(`Poster pentru ${result.show}: https://image.tmdb.org/t/p/w500${posterPath}`);
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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(resultsWithLinks))
        res.end()
    }

}

module.exports = homeService;
