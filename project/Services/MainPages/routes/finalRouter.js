const { RouterController } = require("../../../modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const {generateSwaggerDoc} = require("./mainSwagger");
const {routerController: authRouterController} = require("../../FrontendService/routes/authRoutes");

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

generateSwaggerDoc(routerController, 'Services/MainPages/mainSwagger.json');
module.exports = { routerController };