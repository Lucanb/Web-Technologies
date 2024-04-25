const querystring = require("querystring");
const Password = require("../../Authentication/modules/password");
const Token = require("../../Authentication/modules/token");
const url = require("url");
const axios = require("axios");
const favoritesModel = require('../model/favorites/favoritesModel')
const config = require('../configuration/config.js')

class favoritesService{
    constructor() {}

    async add(req,res){
        const id_user = 1;
        const id_actor = 515;
        try{
            const model = new favoritesModel();
            await model.addToFavorites(id_user,id_actor);
            res.writeHead(200, { 'Content-Type': 'application/json' });
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error: add to favorites" });
        }
    }

    async getAllFavorites(req,res){
        const id_user = 1;
        try{
            const model = new favoritesModel();
            const results = await model.getAllFavorites(id_user);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(results))
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error: get all favorites" });
        }
    }
}

module.exports = favoritesService;