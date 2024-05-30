//const Router =require("./router")
const path = require('path')
const {parse} = require("querystring");
const {Router} = require("./router")
class RouterController {
    constructor(routes) {
        this.routes = routes;
    }

    addRoute(route) {
        this.routes.push(route);
    }

    handleRequest(req, res) {
        const { method, url } = req;
        const matchedRoute = this.findMatchingRoute(method, url);

        if (matchedRoute) {
            try {
                matchedRoute.handler(req, res);
            } catch (error) {
                const internalErrorResponse = Router.internalError("Internal server error occurred.");
                res.writeHead(internalErrorResponse.statusCode);
                res.end(JSON.stringify(internalErrorResponse));
            }
        } else {
            const notFoundResponse = Router.notFound("Route not found.");
            res.writeHead(notFoundResponse.statusCode);
            res.end(JSON.stringify(notFoundResponse));
        }
    }

    findMatchingRoute(method, url) {
        const parsedUrl = new URL(url, 'http://localhost');
        return this.routes.find(route => {
            const routePathParts = route.path.split('/');
            const parsedUrlPathParts = parsedUrl.pathname.split('/');

            if (routePathParts.length !== parsedUrlPathParts.length) {
                return false;
            }

            for (let i = 0; i < routePathParts.length; i++) {
                if (routePathParts[i] !== parsedUrlPathParts[i] && !routePathParts[i].startsWith(':')) {
                    return false;
                }
            }

            return route.method === method;
        });
    }
}

module.exports={RouterController,Router};