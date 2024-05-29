// const http = require('http');
// const httpProxy = require('http-proxy');
//
// const proxy = httpProxy.createProxyServer({});
//
// //aici pentru accesare exclusiva cu gateway.
// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//     proxyReq.setHeader('X-Gateway-Auth', 'expected_secret_value');
// });
//
// const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//
//     if (req.url.startsWith('/luca-app/auth/')) {
//         proxy.web(req, res, { target: 'http://localhost:3000' });
//     } else if (req.url.startsWith('/luca-app/main/')) {
//         proxy.web(req, res, {target: 'http://localhost:3001'});
//     } else if (req.url.startsWith('/luca-app/admin/')) {
//             proxy.web(req, res, { target: 'http://localhost:3002' });
//     }else if (req.url.startsWith('/luca-app/front/')) {
//         proxy.web(req, res, { target: 'http://localhost:3003' });
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// });
//
// const port = 5000;
// server.listen(port, () => {
//     console.log(`API Gateway is running on http://luca-app:${port}`);
// });
const http = require('http');
const { routeRequest } = require('./controller/gatewayController');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    routeRequest(req, res);
});

const port = 5000;
server.listen(port, () => {
    console.log(`API Gateway is running on http://luca-app:${port}`);
});
