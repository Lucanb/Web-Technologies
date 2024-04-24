const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const config = require('../configuration/config.js')

class actorService {
    constructor() {
    }

    async info(req, res) {
        try {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname;
            const segments = path.split('/');
            if (segments.length === 3 && segments[1] === "actor-profile") {
                const id = segments[2];
                const apiKey = config.api_key;
                const apiUrl = `https://api.themoviedb.org/3/person/${id}?language=en-US&api_key=${apiKey}`;
                const response = await axios.get(apiUrl);

                if (response.status !== 200) {
                    throw new Error('Nu am putut obține informațiile despre actor.');
                }
                console.log(response.data.name);
                if(response.data.name != null){
                    const apiKey = config.api_key;
                    const apiUrl = `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&query=${response.data.name}&api_key=${apiKey}`;
                    const new_response = await axios.get(apiUrl);

                    if (new_response.status !== 200) {
                        throw new Error('Nu am putut obține informațiile despre actor.');
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(new_response.data))
                    res.end()
                }
            } else {
                console.error('Eroare interna la ruta - ales nasol');
            }
        } catch (error) {
            console.error('Eroare interna la obținerea informațiilor despre actor:', error);
        }
    }


}

module.exports = actorService;