const { RouterController } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const { Router } = require("../../../modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {authController} = require("../controllers/authController")

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

// routerController.addRoute(
//     new Router("GET", "/luca-app/auth/styles/authentification.css", async (req, res) => {
//         fs.readFile("Frontend/styles/authentification.css", (err, data) => {
//             if (err) {
//                 res.writeHead(404, {'Content-Type': 'text/css'});
//                 return res.end('404 Not Found');
//             }
//             res.writeHead(200, {'Content-Type': 'text/css'});
//             res.write(data);
//             res.end();
//         });
//     })
// );

// routerController.addRoute(new Router("GET","/luca-app/auth/login",async (req,res)=>{
//     fs.readFile("Frontend/views/auth/login.html",(err, data)=>{
//         if(err){
//             res.writeHead(404, {'Content-Type': 'text/html'});
//             // console.log(err)
//             return res.end('404 Not Found');
//         }
//         res.writeHead(200, {'Content-Type' : 'text/html'});
//         res.write(data);
//         res.end();
//     })
// })
// );

routerController.addRoute(new Router("POST","/luca-app/auth/login",async (req,res,next)=>{
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


// routerController.addRoute(new Router("GET","/luca-app/auth/register",async (req,res)=>{
//         fs.readFile("Frontend/views/auth/register.html",(err, data)=>{
//             if(err){
//                 res.writeHead(404, {'Content-Type': 'text/html'});
//                 return res.end('404 Not Found');
//             }
//             res.writeHead(200, {'Content-Type' : 'text/html'});
//             res.write(data);
//             res.end();
//         })
//     })
// )

routerController.addRoute(new Router("POST","/luca-app/auth/register",async (req,res,next)=>{
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

routerController.addRoute(new Router("POST","/luca-app/auth/register_userCredentialsExists",async (req,res,next)=>{
        try {
            const controller = new authController();
            const registered = await controller.userNameEmailExists(req,res,next);
            return registered;

        } catch (error) {
            console.error("Error register user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
)

// routerController.addRoute(new Router("GET","/luca-app/auth/forgot",async (req,res)=>{
//         fs.readFile("Frontend/views/auth/forgot.html",(err, data)=>{
//             if(err){
//                 res.writeHead(404, {'Content-Type': 'text/html'});
//                 return res.end('404 Not Found');
//             }
//             res.writeHead(200, {'Content-Type' : 'text/html'});
//             res.write(data);
//             res.end();
//         })
//     })
// )

routerController.addRoute(new Router("POST","/luca-app/auth/forgot",async (req,res)=>{
        try {
            const controller = new authController();
            const sendEmail = await controller.sendEmail(req,res);
            return sendEmail;

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
)

// routerController.addRoute(new Router("GET","/luca-app/auth/update-password/:",async (req,res)=>{
//         fs.readFile("Frontend/views/auth/update-password.html",(err, data)=>{
//             if(err){
//                 res.writeHead(404, {'Content-Type': 'text/html'});
//                 return res.end('404 Not Found');
//             }
//             res.writeHead(200, {'Content-Type' : 'text/html'});
//             res.write(data);
//             res.end();
//         })
//     })
// )

routerController.addRoute(new Router("POST","/luca-app/auth/update-password/:",async (req, res)=>{
        try {
            const controller = new authController();
            const updatePassword = await controller.changePassword(req,res);
            return updatePassword;

        } catch (error) {
            console.error("Error forgot password user", error);
            // res.writeHead(500, {'Content-Type': 'text/plain'});
            // res.end("Internal Error");
        }
    })
)

module.exports = { routerController };