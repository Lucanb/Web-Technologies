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
}

module.exports = {favoritesController}