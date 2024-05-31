const fs = require("fs")
class Router
{
    constructor(method, path, handler, summary = '', description = '', config = {}) {
        this.method = method;
        this.path = path;
        this.handler = handler;
        this.summary = summary;
        this.description = description;
        this.config = {
            parameters: [],
            requestBody: {},
            responses: {},
            ...config // Spread to include any extra predefined configurations
        };
    }

    static badRequest(message){
        return{
            custom : 1,
            statusCode : 400,
            statusMessage : "Bad Request",
            message : message,
        };
    }
    static notFound(message) {
        return {
            custom: 1,
            statusCode: 404,
            statusMessage: "Not Found",
            message: message,
        };
    }
    static internalError(message) {
        return {
            custom: 1,
            statusCode: 500,
            statusMessage: "Internal Error",
            message: message,
        };
    }
    static successResponse(req, res, obj) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(obj));
    }
}


module.exports = {Router};
