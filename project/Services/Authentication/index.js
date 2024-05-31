const { config } = require("./configuration/configApplication");
const http = require("http");
const { routerController } = require("./routes/authRoutes");
const fs = require('fs')
const path = require('path')
const index = http.createServer((req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000'); // Allow only requests from this origin //luca-app
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // The methods you want to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // The headers you want to allow
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.headers['x-gateway-auth'] !== 'expected_secret_value') {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Denied: Invalid Gateway Credentials');
        return;
    }
    if (req.url === '/swagger.json') {
        fs.readFile(path.join(__dirname, 'authSwagger.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to load Swagger documentation' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else {
        routerController.handleRequest(req, res);
    }
});

const port = config.PORT;
index.listen(port, () => {
    console.log(`Serverul ascultă pe portul ${port}`);
});
