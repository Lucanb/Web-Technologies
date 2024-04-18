const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../configuration/config');

class JWToken{
    static async generateKey(data, settings = {}){
        const privateKey = fs.readFileSync(config.JWT_PRIVATE_KEY); // vezi faza cu schimbul de fisiere
        const token = await jwt.sign(data, privateKey, {
            algorithm: 'RS256',
            expiresIn: settings?.expiresIn || '6h',
            ...settings,
        });
        return token;
    }

    static async validate(token, settings = {}){
        const publicKey = fs.readFileSync(config.JWT_PUBLIC_KEY) //
        const data = await jwt.verify(token, publicKey, {
            algorithm: 'RS256',
            ...settings,
        });
        return [data, true];
    }
}

module.exports = JWToken;