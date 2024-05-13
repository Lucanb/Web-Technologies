// const favoritesService = require('../services/favoritesService');
const adminService = require('../services/adminService');
const {parse} = require("url");

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

    async nominated(req,res){
        try {
            const service = new adminService();
            await service.getNominated(req,res)
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async addAnnounce(req,res){
        try {
            const service = new adminService();
            await service.addAnnounce(req,res)
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async getUsers(req,res){
        const queryParams = parse(req.url, true).query;
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 5;
        try{
            const service = new adminService();
            const users = await service.getUsers(page,limit)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async feedAnnounces(req, res) {
        const queryParams = parse(req.url, true).query;
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 5;
        try {
            const service = new adminService();
            const getService = await service.announces(page,limit)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(getService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async deleteFeedAnnounces(req, res) {
        const queryParams = parse(req.url, true).query;
        const title = queryParams.title || 1;
        try {
            const service = new adminService();
            const deleteService = await service.deleteAnnounces(title)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deleteService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async UpdateFeedAnnounces(req, res) {
        const queryParams = parse(req.url, true).query;
        const title = queryParams.title || 1;
        const start_date = queryParams.start_date || 1;
        const end_date = queryParams.end_date || 1;
        const topic = queryParams.topic || 1;
        const author = queryParams.author || 1;
        const picture = queryParams.picture || 1;
        const content = queryParams.content || 1;
        try {
            const service = new adminService();
            const updateService = await service.updateAnnounces(title,start_date,end_date,topic,author,picture,content)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updateService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async addUser(req,res){
        const queryParams = parse(req.url, true).query;
        const username = queryParams.username || 1;
        const password = queryParams.password || 1;
        const email = queryParams.email || 1;
        const lastusername = queryParams.lastusername || 1;
        try {
            const service = new adminService();
            const addService = await service.addUser(username,password,email,lastusername)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(addService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async deleteUser(req,res){
        const queryParams = parse(req.url, true).query;
        const username = queryParams.username || 1;
        try {
            const service = new adminService();
            const deleteService = await service.deleteUsers(username)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deleteService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async updateUser(req,res){
        const queryParams = parse(req.url, true).query;
        const username = queryParams.username || 1;
        const password = queryParams.password || 1;
        const email = queryParams.email || 1;
        try {
            const service = new adminService();
            const updateService = await service.updateUsers(username,password,email)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updateService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
}

module.exports = {adminController: adminController}