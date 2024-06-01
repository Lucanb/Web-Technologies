const { Router } = require("../app_modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const getTokenStatus = require("../modules/protected");

const internalRoutes = [
];


module.exports = { internalRoutes };