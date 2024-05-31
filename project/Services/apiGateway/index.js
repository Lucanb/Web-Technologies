const http = require('http');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');  // Import YAML library
const { routeRequest } = require('./controller/gatewayController');
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

const services = [
    { name: 'auth', url: 'http://localhost:3000/swagger.json' },
    { name: 'main', url: 'http://localhost:3001/swagger.json' },
    { name: 'admin', url: 'http://localhost:3002/swagger.json' },
    { name: 'front', url: 'http://localhost:3003/swagger.json' }
];

const finalSwaggerDoc = {
    openapi: "3.0.0",
    info: {
        title: "API Gateway Documentation",
        version: "1.0.0",
        description: "This is the consolidated API documentation for all services."
    },
    paths: {}
};

const mergePaths = (target, source) => {
    for (let path in source) {
        if (source.hasOwnProperty(path)) {
            if (!target[path]) {
                target[path] = source[path];
            } else {
                for (let method in source[path]) {
                    if (source[path].hasOwnProperty(method)) {
                        target[path][method] = source[path][method];
                    }
                }
            }
        }
    }
};

const fetchSwaggerDoc = (url) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'X-Gateway-Auth': 'expected_secret_value'
            }
        };
        http.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        const error = new Error(`Request failed with status code ${res.statusCode}`);
                        console.error(`Error fetching Swagger doc from ${url}: ${error.message}`);
                        reject(error);
                    }
                    resolve(JSON.parse(data));
                } catch (error) {
                    console.error(`JSON parsing error from ${url}: ${error.message}`);
                    reject(error);
                }
            });
        }).on('error', (err) => {
            console.error(`HTTP error from ${url}: ${err.message}`);
            reject(err);
        });
    });
};

const fetchSwaggerDocs = async () => {
    for (let service of services) {
        try {
            const data = await fetchSwaggerDoc(service.url);
            if (data) {
                mergePaths(finalSwaggerDoc.paths, data.paths);
            }
        } catch (error) {
            console.error(`Error fetching Swagger doc from ${service.url}:`, error.message);
        }
    }

    const yamlStr = yaml.dump(finalSwaggerDoc);
    fs.writeFileSync(path.join(__dirname, 'finalSwagger.yaml'), yamlStr);
    console.log("Swagger documentation has been successfully combined and converted to YAML!");
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.url === '/api-docs') {
        res.writeHead(301, { 'Location': '/api-docs/index.html' });
        res.end();
    } else if (req.url.startsWith('/api-docs/swagger.yaml')) {
        fs.readFile(path.join(__dirname, 'finalSwagger.yaml'), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/yaml' });
                res.end(JSON.stringify({ error: 'Swagger YAML file not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/yaml' });
                res.end(data);
            }
        });
    } else if (req.url.startsWith('/api-docs')) {
        const filePath = path.join(swaggerUiAssetPath, req.url.replace('/api-docs', ''));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                const ext = path.extname(filePath);
                let contentType = 'text/plain';
                switch (ext) {
                    case '.html': contentType = 'text/html'; break;
                    case '.css': contentType = 'text/css'; break;
                    case '.js': contentType = 'application/javascript'; break;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    } else {
        routeRequest(req, res);
    }
});

const port = 5000;
server.listen(port, async () => {
    await fetchSwaggerDocs();
    console.log(`API Gateway is running on http://localhost:${port}`);
});
