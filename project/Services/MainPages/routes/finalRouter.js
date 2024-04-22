const { RouterController } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const { Router } = require("../../../modules/controllers/routerController");
const JWToken = require('../modules/token');
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {authController} = require("../controllers/mainController")

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});


module.exports = { routerController };