const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Gateway-Auth', 'expected_secret_value');
});

const proxyRequest = (req, res, target) => {
    proxy.web(req, res, { target });
};

module.exports = { proxyRequest };
