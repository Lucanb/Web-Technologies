const homeFeedService = require('../services/homeFeedService')
const actorService = require('../services/actorService')
const adminService = require("../../Admin/services/adminService");

class statisticController {

    async statisticGenre(req,res){
        try {
            const service = new actorService();
            const getService = await service.statisticGenre(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async statisticAwards(req,res){
        try {
            const service = new actorService();
            const getService = await service.statisticAwards(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async statisticPopularity(req, res){
        try {
            const service = new actorService();
            const getService = await service.statisticPopularity(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
}

module.exports = {statisticController}

