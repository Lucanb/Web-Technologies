const Token = require("../../Authentication/modules/token");
const config = require('../configuration/config.js')
const AdminModel = require('../model/adminModel')
const querystring = require("querystring");
const homeModel = require("../../MainPages/model/home/homeFeederModel");
const Password = require('../modules/password');
class adminService {
    constructor() {
    }

    async announces(page,limit) {
            const offset = (page - 1) * limit;
            const announceModel = new homeModel();
            const rows = await announceModel.getAnnouncesNews()
            const limitedAnnounces = rows.slice(offset, offset + limit);
            return limitedAnnounces
    }

    async deleteAnnounces(title) {
        const announceModel = new homeModel();
        const rows = await announceModel.DeleteAnnouncesNews(title)
        return rows
    }

    async updateAnnounces(title,start_date,end_date,topic,author,picture,content) {
        const announceModel = new homeModel();
        const rows = await announceModel.updateAnnouncesNews(title,start_date,end_date,topic,author,picture,content)
        return rows
    }

    async getNominated(req,res){
        const adminModel = new AdminModel()
        const results = await adminModel.getNominated()

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(results))
        res.end()
    }

    async addAnnounce(req,res){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        const data = await new Promise((resolve, reject) => {
            req.on('end', () => {
                try {
                    // Parse the string body as JSON
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        });

        console.log(data.start_date);
        console.log(data.end_date);
        console.log(data.topic);
        console.log(data.title);
        console.log(data.author);
        console.log(data.picture);
        console.log(data.content);

        const adminModel = new AdminModel();
        const results = await adminModel.addAnnounce(
            data.start_date,
            data.end_date,
            data.topic,
            data.title,
            data.author,
            data.picture,
            data.content
        );

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: true, results}));
    } catch (error) {
        console.error('Error in addAnnounce:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success: false, error: error.message}));
    }

    async getUsers(page, limit){
        const offset = (page - 1) * limit;
        const adminModel = new AdminModel();
        const users = await adminModel.getUsers();
        const limitedUsers = users.slice(offset, offset + limit);

        return limitedUsers;
    }

    async deleteUsers(username){
        const adminModel = new AdminModel();
        return await adminModel.deleteUsers(username)
    }

    async updateUsers(username,password,email){
        let hashPassword = '';
        if (password) {
            hashPassword = await Password.crypt(password)
        } //aici trb parola initiala sa nu fie schimbata
        const adminModel = new AdminModel();
        return await adminModel.updateUsers(username,hashPassword,email,lastusername);
    }

    async addUser(username,password,email)
    {
        let hashPassword = ''
        console.log(password)
        if (password){
            hashPassword = await Password.crypt(password)
        }
        const adminModel = new AdminModel()
        return await adminModel.addUsers(username,hashPassword,email)
    }
}
module.exports = adminService;
