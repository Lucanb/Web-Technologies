const { aggregateResponses, proxyRequest } = require('../service/gatewayService');

const routeRequest = (req, res) => {
    if (req.url.startsWith('/luca-app/auth/')) {
        proxyRequest(req, res, 'http://localhost:3000');
    // } else if (req.url.startsWith('/luca-app/main/announces') ||
    //     req.url.startsWith('/luca-app/main/exploreActors') ||
    //     req.url.startsWith('/luca-app/main/toppicks') ||
    //     req.url.startsWith('/luca-app/main/todayActors') ||
    //     req.url.startsWith('/luca-app/main/topPicksWeek') ||
    //     req.url.startsWith('/luca-app/main/topFavorites') ||
    //     req.url.startsWith('/luca-app/main/commingSoon')) {
    //     aggregateResponses(req, res, ['http://localhost:3001']);
    } else if (req.url.startsWith('/luca-app/main/')) {
        proxyRequest(req, res, 'http://localhost:3001');
    } else if (req.url.startsWith('/luca-app/admin/')) {
        proxyRequest(req, res, 'http://localhost:3002');
    } else if (req.url.startsWith('/luca-app/front/')) {
        proxyRequest(req, res, 'http://localhost:3003');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
};

module.exports = { routeRequest };
