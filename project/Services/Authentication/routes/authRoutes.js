const { RouterController } = require("../app_modules/controllers/routerController");
const fs = require("fs");
const { Router } = require("../app_modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {authController} = require("../controllers/authController")
const {generateSwaggerDoc} = require("./authSwagger");

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

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

},    "User Login",
    "Authenticates a user and starts a new session."));

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
    },
    "User Registration",
    "Registers a new user in the system."))

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
    },
    "Check User Credentials",
    "Checks if a username or email already exists in the system."))

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
    },
    "Forgot Password",
    "Sends an email to reset the user's password."))

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
    },
    "Update Password",
    "Updates the user's password using a token."))
generateSwaggerDoc(routerController, 'Services/Authentication/authSwagger.json');

module.exports = { routerController };