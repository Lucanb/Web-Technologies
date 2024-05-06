// const favoritesService = require('../services/favoritesService');

class adminController {

    // async addFavorite(req, res) {
    //     try {
    //         const service = new favoritesService();
    //         const getService = await service.add(req,res)
    //         if (getService) {
    //             res.writeHead(200, { 'Content-Type': 'application/json' });
    //             res.write(JSON.stringify(getService))
    //             res.end()
    //         } else {
    //             res.end()
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.writeHead(500, {'Content-Type': 'application/json'});
    //         res.end(JSON.stringify({success: false, message: 'Internal error'}));
    //     }
    // }
    //
    // async getAllFavorites(req, res) {
    //     try {
    //         const service = new favoritesService();
    //         const getService = await service.getAllFavorites(req,res)
    //         if (getService) {
    //             res.writeHead(200, { 'Content-Type': 'application/json' });
    //             // res.write(JSON.stringify(getService))
    //             res.end()
    //         } else {
    //             res.end()
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.writeHead(500, {'Content-Type': 'application/json'});
    //         res.end(JSON.stringify({success: false, message: 'Internal error'}));
    //     }
    // }
    //
    // async getTopPicks(req, res) {
    //     try {
    //         const service = new favoritesService();
    //         const getService = await service.getTopWeekPicks(req,res)
    //         if (getService) {
    //             res.writeHead(200, { 'Content-Type': 'application/json' });
    //             res.write(JSON.stringify(getService))
    //             res.end()
    //         } else {
    //             res.end()
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.writeHead(500, {'Content-Type': 'application/json'});
    //         res.end(JSON.stringify({success: false, message: 'Internal error'}));
    //     }
    // }
    //
    // async getTopFavorites(req, res) {
    //     try {
    //         const service = new favoritesService();
    //         const getService = await service.getTopFavorites(req,res)
    //         if (getService) {
    //             res.writeHead(200, { 'Content-Type': 'application/json' });
    //             res.write(JSON.stringify(getService))
    //             res.end()
    //         } else {
    //             res.end()
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.writeHead(500, {'Content-Type': 'application/json'});
    //         res.end(JSON.stringify({success: false, message: 'Internal error'}));
    //     }
    // }

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
}

module.exports = {adminController: adminController}