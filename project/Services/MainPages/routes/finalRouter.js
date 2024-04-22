const { RouterController } = require("../../../modules/controllers/routerController");
const { internalRoutes } = require('./internalRoutes');
const routerController = new RouterController(internalRoutes);
const { routerController: indexRouterController } = require('./index');

indexRouterController.routes.forEach(route => {
    routerController.addRoute(route);
});


module.exports = { routerController };