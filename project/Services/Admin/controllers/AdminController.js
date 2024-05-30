// const favoritesService = require('../services/favoritesService');
const adminService = require('../services/adminService');
const {parse} = require("url");
const AdminModel = require("../model/adminModel");
const formidable = require("formidable");

class adminController {


    async logout(req,res){
        const message = req.headers['logout-message'];
        console.log(req.headers)
        console.log(message)
        try {
            if(message === 'LogOut')
            {
                res.setHeader('Set-Cookie', [
                    `accessToken=; HttpOnly; Path=/; SameSite=Strict; Domain=.luca-app`,
                    `refreshToken=; HttpOnly; Path=/; SameSite=Strict; Domain=.luca-app`
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
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });

            req.on('end', async () => {
                try {
                    // Check if the body is empty before attempting to parse it
                    if (!body) {
                        throw new Error('Request body is empty');
                    }

                    // Parse the string body as JSON
                    const data = JSON.parse(body);

                    // Validate the required fields
                    const requiredFields = ['start_date', 'end_date', 'topic', 'title', 'author', 'picture', 'content'];
                    for (let field of requiredFields) {
                        if (!data.hasOwnProperty(field)) {
                            throw new Error(`Missing required field: ${field}`);
                        }
                    }

                    const service = new adminService();
                    const results = await service.addAnnounce(data)

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, results }));
                } catch (error) {
                    console.error('Error in addAnnounce:', error);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({success: false, error: error.message}));
                }
            })
            req.on('error', error => {
                console.error('Error receiving data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            });
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
        console.log(title)
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
        const lasttitle = queryParams.lasttitle || '';
        const title = queryParams.title || '';
        const start_date = queryParams.start_date || '';
        const end_date = queryParams.end_date || '';
        const topic = queryParams.topic || '';
        const author = queryParams.author || '';
        const picture = queryParams.picture || '';
        const content = queryParams.content || '';
        try {
            const service = new adminService();
            const updateService = await service.updateAnnounces(lasttitle,title,start_date,end_date,topic,author,picture,content)
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
        try {
            const service = new adminService();
            const addService = await service.addUser(username,password,email)
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
        const lastusername = queryParams.lastusername || 1;
        try {
            const service = new adminService();
            const updateService = await service.updateUsers(username,password,email,lastusername)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updateService))
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }

    async importcsv(req,res){
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    return 'An error occurred';
                }
                const service = new adminService();
                const updateService = await service.importcsv(err, fields, files)
                if (updateService === 'No CSV file was uploaded.') {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('No CSV file was uploaded.');
                } else if (updateService === 'File path is undefined') {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('File path is undefined');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(JSON.stringify({message: 'File uploaded and processed'}));
                }
            })
        } catch (error) {
            console.log(error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    }
}

module.exports = {adminController: adminController}