//aici am luat codul
'use strict';
const debug = require('debug')('app:middleware:json');

const json = async (req, res, next) => {
    try {
        let body = '';

        req.on('data', (data) => {
            body += data;
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        }).on('end', () => {
            try {
                if (req.headers['content-type'] === 'application/json') {
                    req.body = JSON.parse(body);
                    next();
                } else {
                    debug('Warning: Content-Type is not application/json');
                    next();
                }
            } catch (error) {
                debug('Error parsing JSON body:', error.message);
                res.status(400).send('Bad Request: Invalid JSON format');
            }
        }).on('error', (err) => {
            debug('Error reading request data:', err.message);
            res.status(500).send('Internal Server Error');
        });
    } catch (error) {
        debug('Error in JSON middleware:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    json
};
