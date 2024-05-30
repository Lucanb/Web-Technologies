const {RouterController,Router} = require("../app_modules/controllers/routerController");
const fs = require("fs");
const path = require('path')
const dirPath = path.resolve(__dirname, '../Frontend');
const routerController = new RouterController([    new Router("GET","/luca-app/front/index",async (req,res)=>{
    const filePath = path.join(dirPath, 'views/index.html');
    fs.readFile(filePath,(err, data)=>{
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            // console.log(err)
            return res.end('404 Not Found');
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    })
})])

module.exports = {routerController}