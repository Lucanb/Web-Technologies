const { RouterController } = require("../app_modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {generateSwaggerDoc} = require("./mainSwagger");
const { internalRoutes_unautheticated } = require('./internalUnauthenticated');

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

internalRoutes.forEach(route => {
    routerController.addRoute(route);
});

internalRoutes_unautheticated.forEach(route => {
    routerController.addRoute(route);
});


generateSwaggerDoc(routerController, 'Services/MainPages/mainSwagger.json');
module.exports = { routerController };