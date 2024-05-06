const favoritesService = require('../services/favoritesService');

class favoritesController {

    async addFavorite(req, res) {
        try {
            const service = new favoritesService();
            const getService = await service.add(req,res)
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async getAllFavorites(req, res) {
        try {
            const service = new favoritesService();
            const getService = await service.getAllFavorites(req,res)
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // res.write(JSON.stringify(getService))
                res.end()
            } else {
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async getTopPicks(req, res) {
        try {
            const service = new favoritesService();
            const getService = await service.getTopWeekPicks(req,res)
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async getTopFavorites(req, res) {
        try {
            const service = new favoritesService();
            const getService = await service.getTopFavorites(req,res)
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async deleteFavorites(req, res) {
        try { //deleteFavorites
            const service = new favoritesService();
            const deleteService = await service.deleteFavorites(req,res)
            if (deleteService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(deleteService))
                res.end()
            } else {
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
}

module.exports = {favoritesController}