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

    async exploreActorsTypes(req,res){
        try {
            const service = new homeFeedService();
            const getService = await service.exploreActors(req, res);
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

    async logout(req,res){
        const message = req.headers['logout-message'];
        console.log(req.headers)
        console.log(message)
        try {
            if(message === 'LogOut')
            {
                res.setHeader('Set-Cookie', [
                    `accessToken=''; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`,
                    `refreshToken=''; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                ]);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end()
            }else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                console.log('errror')
                res.end()
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
    async getnotifications(req,res){
        const service = new actorService();
        const getService = await service.getNotifications(req, res);
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

    async addHelp(req,res){
        try {
            const service = new homeFeedService();
            const getService = await service.addHelpMessage(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('fara succes')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async searchBar(req,res){
        try {
            const service = new actorService();
            const getService = await service.search(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('fara succes')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async statisticGenre(req,res){
        try {
            const service = new actorService();
            const getService = await service.statisticGenre(req, res);
            if (getService) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getService))
                res.end()
            } else {
                console.log('fara succes')
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
                console.log('fara succes')
            }
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
}

module.exports = {feedController}

