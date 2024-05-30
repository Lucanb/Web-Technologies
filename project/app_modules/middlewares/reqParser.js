'use strict';

// Middleware-ul de parsare a cererilor
//cod luat
const parser = function(req, res, next) {
    req.query = parseQueryString(req.url);
    next();
}
function parseQueryString(url) {
    const queryString = url.split('?')[1];
    const queryParams = {};

    if(queryString) {
        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            try {
                queryParams[key] = decodeURIComponent(value);
            } catch (error) {
                console.error('Eroare la parsarea query string-ului:', error);
            }
        });
    }

    return queryParams;
}

module.exports = parser;