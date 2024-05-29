const fs = require('fs');
const path = require('path');
const { internalRoutes } = require('./routes');

const generateSwaggerDoc = (routes) => {
    const paths = {};

    routes.forEach(route => {
        const method = route.method.toLowerCase();
        if (!paths[route.path]) {
            paths[route.path] = {};
        }
        paths[route.path][method] = {
            summary: `${method.toUpperCase()} ${route.path}`,
            responses: {
                '200': {
                    description: 'Successful response'
                },
                '400': {
                    description: 'Bad Request'
                },
                '404': {
                    description: 'Not Found'
                },
                '500': {
                    description: 'Internal Server Error'
                }
            }
        };
    });

    const swaggerDoc = {
        openapi: '3.0.0',
        info: {
            title: 'Luca App API',
            version: '1.0.0',
            description: 'API Gateway for Luca App'
        },
        paths
    };

    return swaggerDoc;
};

const swaggerDoc = generateSwaggerDoc(internalRoutes);
const swaggerFilePath = path.join(__dirname, 'swagger.json');
fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerDoc, null, 2));
console.log(`Swagger documentation generated at ${swaggerFilePath}`);
