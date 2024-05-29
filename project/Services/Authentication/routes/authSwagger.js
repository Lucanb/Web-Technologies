const fs = require('fs');

const generateSwaggerDoc = (routerController, outputPath) => {
    const paths = {};

    routerController.routes.forEach(route => {
        const path = route.path;
        const method = route.method.toLowerCase();

        if (!paths[path]) {
            paths[path] = {};
        }

        paths[path][method] = {
            tags: ["API"],
            summary: route.summary || `${method.toUpperCase()} ${path}`,
            description: route.description || "",
            responses: {
                200: {
                    description: "Successful response"
                },
                400: {
                    description: "Bad Request"
                },
                404: {
                    description: "Not Found"
                },
                500: {
                    description: "Internal Server Error"
                }
            }
        };
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

    fs.writeFileSync(outputPath, JSON.stringify(swaggerDoc, null, 2));
};

module.exports = { generateSwaggerDoc };
