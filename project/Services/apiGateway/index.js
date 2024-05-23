const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.url.startsWith('/luca-app/auth/')) {
        proxy.web(req, res, { target: 'http://localhost:3000' });
    } else if (req.url.startsWith('/luca-app/main/')) {
        proxy.web(req, res, {target: 'http://localhost:3001'});
    } else if (req.url.startsWith('/luca-app/admin/')) {
            proxy.web(req, res, { target: 'http://localhost:3002' });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 5000;
server.listen(port, () => {
    console.log(`API Gateway is running on http://luca-app:${port}`);
});
