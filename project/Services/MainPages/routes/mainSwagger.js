const fs = require('fs');

const generateSwaggerDoc = (routerController, outputPath) => {
    const paths = {};

    routerController.routes.forEach(route => {
        let path = route.path;
        const method = route.method.toLowerCase();

        route.config = route.config || {};

        if (path.endsWith('/:')) {
            const paramName = "param";
            path = path.replace(/\/:$/, `/{${paramName}}`);
            route.config.parameters = route.config.parameters || [];
            route.config.parameters.push({
                name: paramName,
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: "Dynamic parameter, replace 'param' with the actual parameter name"
            });
        }

        if (!paths[path]) {
            paths[path] = {};
        }

        if (!paths[path][method]) {
            paths[path][method] = {};
        }

        const routeConfig = {
            tags: ["API"],
            summary: route.summary || `${method.toUpperCase()} ${path}`,
            description: route.description || "",
            responses: {
                200: { description: "Successful response" },
                400: { description: "Bad Request" },
                404: { description: "Not Found" },
                500: { description: "Internal Server Error" }
            },
            parameters: route.config.parameters || [],
            requestBody: route.config.requestBody || {}
        };

        // Path parameters extraction
        const pathParams = path.match(/\{([^}]+)\}/g);
        if (pathParams) {
            pathParams.forEach(param => {
                const paramName = param.replace(/[{}]/g, '');
                if (!routeConfig.parameters.some(p => p.name === paramName)) {
                    routeConfig.parameters.push({
                        name: paramName,
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: `Parameter ${paramName}`
                    });
                }
            });
        }

        if (['post', 'put', 'patch'].includes(method)) {
            routeConfig.requestBody = {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {

                            }
                        }
                    },
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {

                            }
                        }
                    }
                }
            };
        }

        paths[path][method] = routeConfig;
    });

    const swaggerDoc = {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for our project."
        },
        paths: paths
    };

    try {
        fs.writeFileSync(outputPath, JSON.stringify(swaggerDoc, null, 2));
        console.log("Swagger documentation generated successfully!");
    } catch (error) {
        console.error("Failed to write Swagger documentation:", error);
    }
};

module.exports = { generateSwaggerDoc };
