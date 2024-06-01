const {RouterController,Router} = require("../app_modules/controllers/routerController");
const fs = require("fs");
const path = require('path')
const dirPath = path.resolve(__dirname, '../Frontend');
const routerController = new RouterController([
    new Router("GET","/luca-app/front/login",async (req,res)=>{
        const filePath = path.join(dirPath, 'views/auth/login.html');
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
    },
        "User Login Page",
        "Serves the login HTML page for users.")
]);

routerController.addRoute(new Router("GET","/luca-app/front/register",async (req,res)=>{
    const filePath = path.join(dirPath, 'views/auth/register.html');
        fs.readFile(filePath,(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    },
    "Forgot Password Page",
    "Serves the forgot password HTML page for users to reset their passwords."
    )
)

routerController.addRoute(new Router("GET","/luca-app/front/forgot",async (req,res)=>{
    const filePath = path.join(dirPath, 'views/auth/forgot.html');
        fs.readFile(filePath,(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    },
    "Forgot Password Page",
    "Serves the forgot password HTML page for users to reset their passwords.")
)

routerController.addRoute(new Router("GET","/luca-app/front/update-password/:",async (req,res)=>{
    const filePath = path.join(dirPath, 'views/auth/update-password.html');
        fs.readFile(filePath,(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    },
    "Update Password Page",
    "Serves the update password HTML page for users to update their password using a token.")
)
module.exports ={routerController}