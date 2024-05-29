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

// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const { routeRequest } = require('./controller/gatewayController');
// const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
//
// const services = [
//     { name: 'auth', url: 'http://localhost:3000/swagger.json' },
//     { name: 'main', url: 'http://localhost:3001/swagger.json' },
//     { name: 'admin', url: 'http://localhost:3002/swagger.json' },
//     { name: 'front', url: 'http://localhost:3003/swagger.json' }
// ];
//
// const finalSwaggerDoc = {
//     openapi: "3.0.0",
//     info: {
//         title: "API Gateway Documentation",
//         version: "1.0.0",
//         description: "This is the consolidated API documentation for all services."
//     },
//     paths: {}
// };
//
// // Function to merge paths
// const mergePaths = (target, source) => {
//     for (let path in source) {
//         if (source.hasOwnProperty(path)) {
//             if (!target[path]) {
//                 target[path] = source[path];
//             } else {
//                 for (let method in source[path]) {
//                     if (source[path].hasOwnProperty(method)) {
//                         target[path][method] = source[path][method];
//                     }
//                 }
//             }
//         }
//     }
// };
//
// const fetchSwaggerDocs = async () => {
//     for (let service of services) {
//         const data = await fetchSwaggerDoc(service.url);
//         if (data) {
//             mergePaths(finalSwaggerDoc.paths, data.paths);
//         }
//     }
//
//     fs.writeFileSync(path.join(__dirname, 'finalSwagger.json'), JSON.stringify(finalSwaggerDoc, null, 2));
//     console.log("Swagger documentation has been successfully combined!");
// };
//
// const fetchSwaggerDoc = (url) => {
//     return new Promise((resolve, reject) => {
//         http.get(url, (res) => {
//             let data = '';
//
//             res.on('data', (chunk) => {
//                 data += chunk;
//             });
//
//             res.on('end', () => {
//                 try {
//                     resolve(JSON.parse(data));
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         }).on('error', (err) => {
//             reject(err);
//         });
//     });
// };
//
// const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//
//     if (req.url === '/api-docs') {
//         res.writeHead(301, { Location: '/api-docs/index.html' });
//         res.end();
//     } else if (req.url.startsWith('/api-docs/swagger.json')) {
//         fs.readFile(path.join(__dirname, 'finalSwagger.json'), (err, data) => {
//             if (err) {
//                 res.writeHead(404, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ error: 'Swagger file not found' }));
//             } else {
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(data);
//             }
//         });
//     } else if (req.url.startsWith('/api-docs')) {
//         const filePath = path.join(swaggerUiAssetPath, req.url.replace('/api-docs', ''));
//         fs.readFile(filePath, (err, data) => {
//             if (err) {
//                 res.writeHead(404, { 'Content-Type': 'text/plain' });
//                 res.end('Not Found');
//             } else {
//                 const ext = path.extname(filePath);
//                 const contentType = ext === '.html' ? 'text/html' :
//                     ext === '.css' ? 'text/css' :
//                         ext === '.js' ? 'application/javascript' : 'text/plain';
//                 res.writeHead(200, { 'Content-Type': contentType });
//                 res.end(data);
//             }
//         });
//     } else {
//         routeRequest(req, res);
//     }
// });
//
// const port = 5000;
// server.listen(port, () => {
//     // await fetchSwaggerDocs();
//     console.log(`API Gateway is running on http://luca-app:${port}`);
// });


const http = require('http');
const fs = require('fs');
const path = require('path');
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

// Function to merge paths
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

    fs.writeFileSync(path.join(__dirname, 'finalSwagger.json'), JSON.stringify(finalSwaggerDoc, null, 2));
    console.log("Swagger documentation has been successfully combined!");
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
                        throw new Error(`Request failed with status code ${res.statusCode}`);
                    }
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.url === '/api-docs') {
        res.writeHead(301, { Location: '/api-docs/index.html' });
        res.end();
    } else if (req.url.startsWith('/api-docs/swagger.json')) {
        fs.readFile(path.join(__dirname, 'finalSwagger.json'), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Swagger file not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
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
                const contentType = ext === '.html' ? 'text/html' :
                    ext === '.css' ? 'text/css' :
                        ext === '.js' ? 'application/javascript' : 'text/plain';
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
    console.log(`API Gateway is running on http://luca-app:${port}`);
});