const httpProxy = require('http-proxy');
const fetch = require('node-fetch');

const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Gateway-Auth', 'expected_secret_value');
});

const proxyRequest = (req, res, target) => {
    proxy.web(req, res, { target });
};

const aggregateResponses = async (req, res, targets) => {
    try {
        const responses = await Promise.all(targets.map(target => fetch(target + req.url)));
        const data = await Promise.all(responses.map(response => response.json()));

        const aggregatedData = data.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(aggregatedData));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error in aggregating responses');
    }
};

module.exports = { aggregateResponses, proxyRequest };
