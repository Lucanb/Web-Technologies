const Token = require("../../Authentication/modules/token");
const config = require('../configuration/config.js')
const AdminModel = require('../model/adminModel')
const querystring = require("querystring");
const Password = require('../modules/password');
const formidable = require('formidable');
const fs = require('fs')
class adminService {
    constructor() {
    }

    async announces(page,limit) {
            const offset = (page - 1) * limit;
            const announceModel = new AdminModel();
            const rows = await announceModel.getAnnouncesNews()
            const limitedAnnounces = rows.slice(offset, offset + limit);
            return limitedAnnounces
    }

    async deleteAnnounces(title) {
        const announceModel = new AdminModel();
        const rows = await announceModel.DeleteAnnouncesNews(title)
        return rows
    }

    async updateAnnounces(lasttitle,title,start_date,end_date,topic,author,picture,content) {
        const announceModel = new AdminModel();
        const rows = await announceModel.updateAnnouncesNews(lasttitle,title,start_date,end_date,topic,author,picture,content)
        return rows
    }

    async getNominated(req,res){
        const adminModel = new AdminModel()
        const results = await adminModel.getNominated()

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(results))
        res.end()
    }

    async addAnnounce(data) {

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
                return results
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

    async updateUsers(username,password,email,lastusername){
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
        console.log(username)
        console.log(password)
        console.log(email)
        if (password){
            hashPassword = await Password.crypt(password)
        }
        const adminModel = new AdminModel()
        return await adminModel.addUsers(username,hashPassword,email)
    }


    async importcsv(err, fields, files)
    {
            const csvFile = files.csvFile[0];

            if (!csvFile) {
                return 'No CSV file was uploaded.';
            }

            const filePath = csvFile.filepath;
            if (!filePath) {
                return 'File path is undefined';
            }

            fs.readFile(filePath, 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return 'Failed to read file';
                }
                console.log(data)
                const adminModel = new AdminModel()
                await adminModel.importCsv(data)
                return 'File uploaded and processed'
            });
    }
}
module.exports = adminService;
