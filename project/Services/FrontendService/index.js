const { config } = require("./configuration/configApplication");
const http = require("http");
const { routerController } = require("./routes/finalRouter");
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, 'Frontend/public');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const index = http.createServer((req, res) => {
    console.log(`Request for ${req.url} received.`);

    let filePath;
    let extname = String(path.extname(req.url)).toLowerCase();
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    if (req.url.startsWith('/luca-app/front/public/')) {
        console.log(publicDir)
        filePath = path.join(publicDir, req.url.replace('/luca-app/front/public/', ''));
        console.log(`Serving static file: ${filePath}`);

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    if (!res.headersSent) {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.end('<h1>404 Not Found</h1>', 'utf-8');
                    }
                } else {
                    if (!res.headersSent) {
                        res.writeHead(500);
                        res.end(`Sorry, there was an error: ${error.code} ..\n`);
                    }
                }
            } else {
                if (!res.headersSent) {
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                }
            }
        });
    }else if (req.url === '/swagger.json') {
        fs.readFile(path.join(__dirname, 'frontSwagger.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to load Swagger documentation' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000'); // Allow only requests from this origin
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // The methods you want to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // The headers you want to allow
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.headers['x-gateway-auth'] !== 'expected_secret_value') {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Access Denied: Invalid Gateway Credentials');
            return;
        }

        routerController.handleRequest(req, res);
    }
});

const port = config.PORT;
index.listen(port, () => {
    console.log(`Serverul ascultă pe portul ${port}`);
});
