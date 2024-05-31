const { Router } = require("../app_modules/controllers/routerController");
const fs = require("fs");
const {feedController} = require("../controllers/feedController");
const {favoritesController} = require("../controllers/favoritesController");
const getTokenStatus = require("../modules/protected");

const internalRoutes_unautheticated = [
    new Router("GET", '/luca-app/main/announces_unauthenticated', async (req, res) => {
        try {
                const controller = new feedController();
                const feedDone = await controller.feedAnnounces(req,res);
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/luca-app/main/toppicks_unauthenticated', async (req, res) => {
        try {
                const controller = new feedController();
                const feedDone = await controller.feedTopPicks(req,res);
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/luca-app/main/todayActors_unauthenticated', async (req, res) => {
        try {
                const controller = new feedController();
                const feedDone = await controller.feedTodayActors(req,res);
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/luca-app/main/commingSoon_unauthenticated', async (req, res) => {
        try{
                const controller = new feedController();
                const feedDone = await controller.feedCommingSoon(req, res);
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
];


module.exports = { internalRoutes_unautheticated };