const { Router } = require("../app_modules/controllers/routerController");
const {feedController} = require("../controllers/feedController");

const internalRoutes_unautheticated = [
    new Router(
        "GET",
        '/luca-app/main/announces_unauthenticated',
        async (req, res) => {
            try {
                const controller = new feedController();
                const feedDone = await controller.feedAnnounces(req,res);
            } catch (error) {
                console.error("Error while fetching public announcements", error);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Internal Error");
            }
        },
        'Fetch Public Announcements',
        'Retrieves the latest public announcements without requiring user authentication.'
    ),

    new Router(
        "GET",
        '/luca-app/main/toppicks_unauthenticated',
        async (req, res) => {
            try {
                const controller = new feedController();
                const feedDone = await controller.feedTopPicks(req,res);
            } catch (error) {
                console.error("Error while fetching top picks", error);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Internal Error");
            }
        },
        'Fetch Top Picks',
        'Provides a feed of the top picks content accessible without user authentication.'
    ),
    new Router(
        "GET",
        '/luca-app/main/todayActors_unauthenticated',
        async (req, res) => {
            try {
                const controller = new feedController();
                const feedDone = await controller.feedTodayActors(req,res);
            } catch (error) {
                console.error("Error while fetching today's actors", error);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Internal Error");
            }
        },
        'Fetch Today\'s Actors',
        'Retrieves a feed of today featured actors without needing authentication.'
    ),
    new Router(
        "GET",
        '/luca-app/main/commingSoon_unauthenticated',
        async (req, res) => {
            try {
                const controller = new feedController();
                const feedDone = await controller.feedCommingSoon(req, res);
            } catch (error) {
                console.error("Error while fetching coming soon content", error);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Internal Error");
            }
        },
        'Fetch Coming Soon Content',
        'Retrieves information about upcoming features or content accessible without user authentication.'
    )
];


module.exports = { internalRoutes_unautheticated };