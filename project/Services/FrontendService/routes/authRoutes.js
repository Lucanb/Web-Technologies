const {RouterController,Router} = require("../../../modules/controllers/routerController");
const fs = require("fs");


const routerController = new RouterController([new Router("GET", "/luca-app/front/styles/authentification.css", async (req, res) => {
    fs.readFile("Frontend/styles/authentification.css", (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/css'});
            return res.end('404 Not Found');
        }
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
    });
})]);

routerController.addRoute(new Router("GET","/luca-app/front/login",async (req,res)=>{
        fs.readFile("Frontend/views/auth/login.html",(err, data)=>{
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
);

routerController.addRoute(new Router("GET","/luca-app/front/register",async (req,res)=>{
        fs.readFile("Frontend/views/auth/register.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
)

routerController.addRoute(new Router("GET","/luca-app/front/forgot",async (req,res)=>{
        fs.readFile("Frontend/views/auth/forgot.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
)

routerController.addRoute(new Router("GET","/luca-app/front/update-password/:",async (req,res)=>{
        fs.readFile("Frontend/views/auth/update-password.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
)
module.exports ={routerController}