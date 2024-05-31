const fs = require('fs');
const path = require('path');

const generateSwaggerDoc = (routerController, outputPath) => {
    const paths = {};

    routerController.routes.forEach(route => {
        let path = route.path;
        const method = route.method.toLowerCase();

        // Ensure route.config is initialized
        route.config = route.config || {};

        // Check if the path ends with /: and add a generic path parameter
        if (path.endsWith('/:')) {
            const paramName = "param"; // Placeholder name for the path variable
            path = path.replace(/\/:$/, `/{${paramName}}`); // Replace /: with /{param} for Swagger
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
            paths[path] = {}; // Initialize the path object
        }

        if (!paths[path][method]) {
            paths[path][method] = {}; // Initialize the method object
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
            parameters: route.config.parameters || [],  // Initialize parameters array with existing ones
            requestBody: route.config.requestBody || {}  // Initialize requestBody object with existing one
        };

        // Path parameters extraction
        const pathParams = path.match(/\{([^}]+)\}/g);
        if (pathParams) {
            pathParams.forEach(param => {
                const paramName = param.replace(/[{}]/g, '');
                // Check if the parameter is already added
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

        // General handling for methods that might have bodies
        if (['post', 'put', 'patch'].includes(method)) {
            routeConfig.requestBody = {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                // Define JSON schema properties here
                            }
                        }
                    },
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            properties: {
                                // Define Form-URL Encoded schema properties here
                            }
                        }
                    }
                }
            };
        }

        // Assign the configured routeConfig to the method
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

    // Writing Swagger documentation to the specified output path with error handling
    try {
        fs.writeFileSync(outputPath, JSON.stringify(swaggerDoc, null, 2));
        console.log("Swagger documentation generated successfully!");
    } catch (error) {
        console.error("Failed to write Swagger documentation:", error);
    }
};

module.exports = { generateSwaggerDoc };
