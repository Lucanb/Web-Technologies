const { RouterController } = require("../../../modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');
const { generateSwaggerDoc } = require('./adminSwagger');

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});

generateSwaggerDoc(indexRouterController, 'Services/Admin/routes/adminSwagger.json');

module.exports = { routerController };

