const { RouterController } = require("../app_modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const { generateSwaggerDoc } = require('./adminSwagger');

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

generateSwaggerDoc(routerController, 'Services/Admin/adminSwagger.json');

module.exports = { routerController };

