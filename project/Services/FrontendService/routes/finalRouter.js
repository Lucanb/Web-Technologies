const { RouterController } = require("../../../modules/controllers/routerController");
const { internalRoutes } = require('./mainPageRoutes');
const routerController = new RouterController([]);
const { routerController: adminRouterController  } = require('./adminRoutes');
const {routerController: authRouterController } = require("./authRoutes")
const {routerController: mainPageRouterController } = require("./mainPageRoutes")
const { routerController: indexRouterController } = require('./index');
const {generateSwaggerDoc} = require("./frontSwagger");

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

mainPageRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

adminRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

authRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

generateSwaggerDoc(routerController, 'Services/FrontendService/frontSwagger.json');

module.exports = { routerController };