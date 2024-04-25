const homeFeedService = require('../services/homeFeedService')
const actorService = require('../services/actorService')

class feedController {
    async feedAnnounces(req, res) {
        try {
            const service = new homeFeedService();
            const getService = await service.announces(req,res)
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

    async feedTopPicks(req,res){
        try {
            const service = new homeFeedService();
            const getService = await service.topPicks(req,res)
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

    async feedTodayActors(req,res)
    {
        try {
            const service = new homeFeedService();
            const getService = await service.todayActors(req,res)
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

    async feedCommingSoon(req, res) {
        try {
            const service = new homeFeedService();
            const getService = await service.commingSoon(req,res)
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

    async sendId(req, res) {
        try {
            const service = new actorService();
            const getService = await service.info(req, res);
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

    async sendIdInformations(req,res){
        try {
            const service = new actorService();
            const getService = await service.infoId(req, res);
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

module.exports = {feedController}

