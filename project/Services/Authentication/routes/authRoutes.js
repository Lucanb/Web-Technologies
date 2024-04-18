const { RouterController } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const { Router } = require("../../../modules/controllers/routerController");
const JWToken = require('../modules/token');
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {authController} = require("../controllers/authController")

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

module.exports = { routerController };


routerController.addRoute(new Router("GET", "/home", async (req, res, next) => {
    fs.readFile("../../Frontend/home.html", async (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            console.log(err);
            return res.end('404 Not Found');
        }

    // const dataa = localStorage.getItem('accessToken')
    const headers = req.headers;
    // const [type,token] =  req.headers['authorization'].split(' ');
    const [type, token] = req.headers.authorization.split(' ');
    console.log(type,token)
       if (!token) {
            res.statusCode = 401
            res.write(JSON.stringify({ success: false, message: 'Token missing' }));
            res.end();
        }else {

            try {
                const [dataJwt, isValid] = await JWToken.validate(token);
                if (!isValid) {
                    res.statusCode = 401
                    res.write(JSON.stringify({success: false, message: 'Invalid token'}));
                    res.end();
                }

                req.user = dataJwt; ///
                res.writeHead(200, {'Content-Type' : 'text/html'});
                // res.write(JSON.stringify({success: true, message: 'Valid token'}));
                res.write(data);
                res.end();
                // next();
            } catch (error) {
                console.error('Error validating token:', error);
                res.statusCode = 401
                res.write(JSON.stringify({success: false, message: 'Internal server error'}));
                res.end();
            }
        }
    // res.writeHead(200, {'Content-Type': 'application/json'});
    // res.end(JSON.stringify(headers));
    //     res.writeHead(200, {'Content-Type' : 'text/html'});
    //     res.write(data);
    //     res.end();
    });
}));

routerController.addRoute(
    new Router("GET", "/assets/css/style.css", async (req, res) => {
        fs.readFile("../../Frontend/assets/css/style.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    })
);

routerController.addRoute(new Router("GET","/login",async (req,res)=>{
    fs.readFile("../../Frontend/login.html",(err, data)=>{
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

routerController.addRoute(new Router("POST","/login",async (req,res,next)=>{
    try{
        const controller = new authController();
        await controller.login(req, res,next);
    }catch (error){
        console.error("Error login user", error);
        console.error("Error register user", error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Internal Error");
    }

}));

routerController.addRoute(new Router("GET","/register",async (req,res)=>{
        fs.readFile("../../Frontend/register.html",(err, data)=>{
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

routerController.addRoute(new Router("POST","/register",async (req,res,next)=>{
    try {
        const controller = new authController();
        const registered = await controller.register(req,res,next);
        return registered;

    } catch (error) {
        console.error("Error register user", error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Internal Error");
    }
    })
)


module.exports = { routerController };