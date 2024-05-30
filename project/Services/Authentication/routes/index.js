const {RouterController,Router} = require("../app_modules/controllers/routerController");
const fs = require("fs");
const routerController = new RouterController([
    new Router("GET","/luca-app/auth/index",async (req,res)=>{
        fs.readFile("Frontend/views/index.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                // console.log(err)
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
])

module.exports = {routerController}