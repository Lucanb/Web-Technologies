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

    async topPicks(req, res) {
        const feederModel = new homeFeederModel()
        const results = await feederModel.getTopPicks()
        const resultsWithLinks = [];
        for (const result of results) {
            try {
                const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                const tmdbResponse = await fetch(url);
                const tmdbData = await tmdbResponse.json();
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
                    resultsWithLinks.push({
                        id: actorId, //astea le codific
                        full_name: result.full_name,
                        posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
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

    async todayActors(req, res) {
        const feederModel = new homeFeederModel()
        const results = await feederModel.getTodayActors()
        const resultsWithLinks = [];
        for (const result of results) {
            try {
                const url = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&api_key=${config.api_key}&query=${result.full_name}`;
                const tmdbResponse = await fetch(url);
                const tmdbData = await tmdbResponse.json();
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
                    resultsWithLinks.push({
                        id: actorId,   //ASTEA LE CODIFIC
                        full_name: result.full_name,
                        posterUrl: `https://image.tmdb.org/t/p/w500/${profilePath}`
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

    async commingSoon(req, res) {

        const feederModel = new homeFeederModel()
        const results = await feederModel.getCommingSoon()
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

    // async exploreActors(req, res) {
    //     try {
    //         const genreId = 18;
    //           /*
    //             Acțiune - 28
    //             Aventură - 12
    //             Animație - 16
    //             Comedie - 35
    //             Crimă - 80
    //             Documentar - 99
    //             Dramă - 18
    //             Familie - 10751
    //             Fantezie - 14
    //             Istoric - 36
    //             Horror - 27
    //             Muzică - 10402
    //             Mister - 9648
    //             Romance - 10749
    //             Science Fiction (SF) - 878
    //             Film TV - 10770
    //             Thriller - 53
    //             Război - 10752
    //             Western - 37
    //             */
    //         const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${config.api_key}&with_genres=${genreId}`;
    //
    //         const discoverResponse = await fetch(discoverUrl);
    //         const discoverData = await discoverResponse.json();
    //         const movies = discoverData.results.slice(0, 5);
    //
    //         const resultsWithLinks = [];
    //
    //         for (const movie of movies) {
    //             const movieId = movie.id;
    //             const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${config.api_key}`;
    //
    //             const creditsResponse = await fetch(creditsUrl);
    //             const creditsData = await creditsResponse.json();
    //             const cast = creditsData.cast;
    //
    //             const limitedActors = cast.slice(0, 3).map(actor => ({
    //                 actorId: actor.id,
    //                 actorName: actor.name,
    //                 character: actor.character,
    //                 profilePath: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null
    //             }));
    //
    //             resultsWithLinks.push({
    //                 movieId: movie.id,
    //                 movieTitle: movie.title,
    //                 moviePoster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    //                 actors: limitedActors
    //             });
    //         }
    //
    //         res.writeHead(200, {'Content-Type': 'application/json'});
    //         res.write(JSON.stringify(resultsWithLinks));
    //         res.end();
    //     } catch (error) {
    //         console.error(error);
    //         res.writeHead(500, {'Content-Type': 'application/json'});
    //         res.write(JSON.stringify({ error: 'Internal Server Error' }));
    //         res.end();
    //     }
    // }

        async exploreActors(req, res) {
            try {
                const cookies = req.headers.cookie;
                let genre = null;
                if (cookies) {
                    const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                        const parts = cookie.split('=');
                        acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                        return acc;
                    }, {});
                    genre = cookieObj['selectedGenre'];
                }
                let genreId = 18;
                if (genre === 'Action') {
                    genreId = 28;
                } else if (genre === 'Comedy') {
                    genreId = 35;
                } else if (genre === 'Adventure') {
                    genreId = 12;
                }
                const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${config.api_key}&with_genres=${genreId}`;

                const discoverResponse = await fetch(discoverUrl);
                const discoverData = await discoverResponse.json();

                function shuffle(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                shuffle(discoverData);
                const movies = discoverData.results;

                let actors = [];
                let actorIds = new Set();

                let actorSet = new Set();

                for (const movie of movies) {
                    const movieId = movie.id;
                    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${config.api_key}`;

                    const creditsResponse = await fetch(creditsUrl);
                    const creditsData = await creditsResponse.json();
                    const cast = creditsData.cast;

                    if (cast.length > 0) {
                        const randomActor = cast[Math.floor(Math.random() * cast.length)];
                        if (!actorIds.has(randomActor.id) && actors.length < 7) {
                            if (randomActor.profile_path != null) {
                                const movieToken = await Token.generateKey({
                                    movieID: randomActor.id,
                                    fresh: true,
                                    type: 'access'
                                }, {
                                    expiresIn: '1h'
                                })
                                actorIds.add(movieToken);
                                actors.push({
                                    actorId: movieToken,
                                    actorName: randomActor.name,
                                    character: randomActor.character,
                                    profilePath: randomActor.profile_path ? `https://image.tmdb.org/t/p/w500${randomActor.profile_path}` : null,
                                    movies: movie.title
                                });
                            }
                        }
                    }
                    if (actors.length >= 7) break;
                }

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(actors));
                res.end();
            } catch (error) {
                console.error(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({ error: 'Internal Server Error' }));
                res.end();
            }
        }

        async addHelpMessage(req, res) {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            const data = await new Promise((resolve, reject) => {
                req.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            console.log()
            const feederModel = new homeFeederModel()
            const results = await feederModel.addHelpItem(data.content,data.email)
            // res.writeHead(200, {'Content-Type': 'application/json'});
            // res.end()
            return results
        }catch (error){
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(error)
            return false
        }
    }
}
module.exports = homeService;
