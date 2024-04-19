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


// routerController.addRoute(new Router("GET", "/home", async (req, res, next) => {
//     fs.readFile("../../Frontend/home.html", async (err, data) => {
//         if (err) {
//             res.writeHead(404, {'Content-Type': 'text/html'});
//             console.log(err);
//             return res.end('404 Not Found');
//         }
//
//     // const dataa = localStorage.getItem('accessToken')
//     const headers = req.headers;
//     // const [type,token] =  req.headers['authorization'].split(' ');
//     const [type, token] = req.headers.authorization.split(' ');
//     console.log('headers : ', headers);
//     console.log(type,token);
//     res.writeHead(200, {'Content-Type' : 'text/html'});
//     res.end(JSON.stringify(headers));
//        // if (!token) {
//        //      res.statusCode = 401
//        //      res.write(JSON.stringify({ success: false, message: 'Token missing' }));
//        //      res.end();
//        //  }else {
//        //
//        //      try {
//        //          const [dataJwt, isValid] = await JWToken.validate(token);
//        //          if (!isValid) {
//        //              res.statusCode = 401
//        //              res.write(JSON.stringify({success: false, message: 'Invalid token'}));
//        //              res.end();
//        //          }
//        //
//        //          req.user = dataJwt; ///
//        //          res.writeHead(200, {'Content-Type' : 'text/html'});
//        //          // res.write(JSON.stringify({success: true, message: 'Valid token'}));
//        //          res.write(data);
//        //          res.end();
//        //          // next();
//        //      } catch (error) {
//        //          console.error('Error validating token:', error);
//        //          res.statusCode = 401
//        //          res.write(JSON.stringify({success: false, message: 'Internal server error'}));
//        //          res.end();
//        //      }
//        //  } ---->
//     // res.writeHead(200, {'Content-Type': 'application/json'});
//     // res.end(JSON.stringify(headers));
//     //     res.writeHead(200, {'Content-Type' : 'text/html'});
//     //     res.write(data);
//
//     });
// }));

routerController.addRoute(new Router("GET", "/home", async (req, res, next) => {

    fs.readFile("../../Frontend/home.html", 'utf-8', async (err, html) => {
        if (err) {
            console.error('Error reading file:', err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end('404 Not Found');
        }
        console.log('header : ',JSON.stringify(req.headers))
        // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        //     res.writeHead(401, {'Content-Type': 'text/html'});
        //     return res.end('Authorization header missing or invalid');
        // }

        const cookies = req.headers.cookie;
        let accessToken = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
        }

        // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
        // try {
        //     const decoded = await JWToken.validate(token);
        //     if (!decoded) {
        //         res.writeHead(401, {'Content-Type': 'text/html'});
        //         return res.end('Invalid token');
        //     }
        if (!accessToken) {
            res.writeHead(401, {'Content-Type': 'text/html'});
            return res.end('Authorization cookie missing or invalid');
        }

        try {
            const decoded = await JWToken.validate(accessToken);
            if (!decoded) {
                res.writeHead(401, {'Content-Type': 'text/html'});
                return res.end('Invalid token');
            }

            // User is authenticated, send the HTML page
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        } catch (error) {
            console.error('Error validating token:', error);
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Internal server error');
        }
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