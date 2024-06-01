const { Router } = require("../app_modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const {feedController} = require("../controllers/feedController");
const {favoritesController} = require("../controllers/favoritesController");
const Token = require("../../Authentication/modules/token");
const getTokenStatus = require("../modules/protected");
const {adminController} = require("../../Admin/controllers/AdminController");

const internalRoutes = [
    new Router("GET", "/luca-app/main/altaRuta", async (req, res) => {
        fs.readFile("Frontend/index.html", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", '/luca-app/main/getnotifications', async (req, res) => {
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const feedDone = await controller.getnotifications(req,res);
            }

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Notifications",
        "Retrieves the notifications for the user."),
    new Router("GET", '/luca-app/main/announces', async (req, res) => {
        try {

            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const feedDone = await controller.feedAnnounces(req,res);
            }

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Announces",
        "Retrieves the announcements for the user."
    ),
    new Router("POST","/luca-app/main/send-actor-id",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const sendId = await controller.sendId(req,res);
                return sendId;
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Send Actor ID",
        "Sends the actor ID to the server."),

    new Router("POST","/luca-app/main/actor-profile-info",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const sendId = await controller.sendIdInformations(req,res);
                return sendId;
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Send Actor Profile Info",
        "Sends the actor profile information to the server."),

    new Router("GET", '/luca-app/main/toppicks', async (req, res) => {
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const feedDone = await controller.feedTopPicks(req,res);
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Top Picks",
        "Retrieves the top picks for the user."),
    new Router("GET", '/luca-app/main/todayActors', async (req, res) => {
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const feedDone = await controller.feedTodayActors(req,res);
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Today's Actors",
        "Retrieves the actors featured today."
    ),
    new Router("GET", '/luca-app/main/commingSoon', async (req, res) => {
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                const feedDone = await controller.feedCommingSoon(req, res);
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Coming Soon",
        "Retrieves the list of actors coming soon."),
    new Router("GET", "/luca-app/main/news", async (req, res, next) => {

        fs.readFile("Frontend/views/news.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }

            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
        });
    },
        "Get News Page",
        "Serves the news HTML page for authenticated users."),
    new Router("POST","/luca-app/main/help",async (req,res)=>{
        try {

            const controller = new feedController();
            return await controller.addHelp(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }

    },
        "Add Help Request",
        "Adds a help request to the system."),
    new Router("POST","/luca-app/main/add-favorites",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new favoritesController();
                return await controller.addFavorite(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Add to Favorites",
        "Adds an actor to the user's favorites."),

    new Router("GET","/luca-app/main/all-favorites",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new favoritesController();
                return await controller.getAllFavorites(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get All Favorites",
        "Retrieves all favorite actors for the user."),

    new Router("GET","/luca-app/main/topPicksWeek",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new favoritesController();
                return await controller.getTopPicks(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Top Picks of the Week",
        "Retrieves the top picks of the week for the user."),

    new Router("GET","/luca-app/main/topFavorites",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new favoritesController();
                return await controller.getTopFavorites(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Top Favorites",
        "Retrieves the top favorite actors for the user."),
    new Router("GET","/luca-app/main/exploreActors",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.exploreActorsTypes(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Explore Actors",
        "Allows the user to explore different types of actors."
    ),
    new Router("DELETE","/luca-app/main/delete-actor",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new favoritesController();
                return await controller.deleteFavorites(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Delete Actor",
        "Deletes an actor from the user's favorites."),
    new Router("POST","/luca-app/main/logout",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://luca-app:5000/luca-app/front/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.logout(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Logout",
        "Logs out the user and clears the session."),
    new Router("POST", "/luca-app/main/search", async(req,res) =>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.searchBar(req, res);
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Search",
        "Performs a search based on user input."),
    new Router("POST","/luca-app/main/statisticAwards/:",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.statisticAwards(req, res);
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Award Statistics",
        "Retrieves statistics on awards for a specific actor."),
    new Router("GET","/luca-app/main/nominatedActors",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.nominated(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Nominated Actors",
        "Retrieves a list of actors who have been nominated for awards."),
    new Router("POST","/luca-app/main/statisticGenre/:",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getTokenStatus(cookies)
            if (!tokenStatus.valid){
                if(tokenStatus.message === 'Internal server error')
                {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(tokenStatus.message)
                }else{
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    res.end(tokenStatus.message);
                }
            }else {
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                const controller = new feedController();
                return await controller.statisticGenre(req, res);
            }
        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Genre Statistics",
        "Retrieves statistics on genres for a specific actor.")
];


module.exports = { internalRoutes };