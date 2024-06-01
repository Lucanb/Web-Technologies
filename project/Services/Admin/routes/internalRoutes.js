const { Router } = require("../app_modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const Token = require("../../Authentication/modules/token");
const {adminController} = require("../../Admin/controllers/AdminController");
const Parser = require('rss-parser');
const { URL } = require('url');
const formidable = require('formidable');
const RSS = require('rss');
const {getAdminTokenStatus,getTokenStatus} = require('../modules/protected')

const internalRoutes = [
    new Router("GET", "/luca-app/admin/altaRuta", async (req, res) => {
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
    new Router("POST", "/luca-app/admin/addAnnounce", async (req, res) => {
        try {

            const controller = new adminController();
            return await controller.addAnnounce(req,res)
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Add Announce",
        "Adds a new announcement to the system."),
    new Router("GET", "/luca-app/admin/users", async (req, res) => {
        try {
            const controller = new adminController();
            return await controller.getUsers(req,res)
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },"Get Users",
        "Retrieves a list of all users."),
    new Router("GET", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            const feedDone = await controller.feedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Get Announces",
        "Retrieves all announcements."),
    new Router("PUT", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            return await controller.UpdateFeedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Update Announces",
        "Updates an existing announcement."),
    new Router("DELETE", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            const feedDone = await controller.deleteFeedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Delete Announces",
        "Deletes an announcement."),
    new Router("GET", "/luca-app/admin/get-news/:actor", async (req, res) => {
        const cookies = req.headers.cookie;
        let source = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            source = cookieObj['source'];  // Assuming the token is stored under the key 'accessToken'
        }
        console.log(source)

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment);
        const actor = decodeURIComponent(pathSegments[3].replace(/^:+/, ''));
        console.log(actor)

        const url = `${source}/v/film/news/feed?query=${encodeURIComponent(actor)}`; // Hypothetical URL
        const parser = new Parser();
        try {
            const feed = await parser.parseURL(url);
            const newsItems = feed.items.map(item => ({
                title: item.title,
                link: item.link,
                contentSnippet: item.contentSnippet || '',
                imageUrl: item.enclosure ? item.enclosure.url : '../img/default-image.jpg',
                pubDate: item.pubDate || 'Date not available',
                source: new URL(url).hostname,
                category: item.categories ? item.categories.join(", ") : 'General'
            }));

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(newsItems));
        } catch (error) {
            console.error('Error fetching news for actor:', actor, error);
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Internal server error');
        }
    },
        "Get News for Actor",
        "Fetches news related to a specific actor."),
    new Router("GET", "/luca-app/admin/RSS/:actor", async (req, res) => {
        const cookies = req.headers.cookie;
        let source = null;
        if (cookies) {
            const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                const parts = cookie.split('=');
                acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                return acc;
            }, {});
            source = cookieObj['source'];  // Assuming the token is stored under the key 'accessToken'
        }
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment);
        const actor = decodeURIComponent(pathSegments[2]);

        const feed = new RSS({
            title: 'Variety - Film News',
            description: 'Latest updates on film news from Variety.',
            feed_url: 'http://yourdomain.com/news/RSS',
            site_url: source,
            image_url: `${source}/wp-content/uploads/2018/06/variety-favicon.png`,
            language: 'en',
            pubDate: new Date().toUTCString(),
            ttl: 60
        });

        try {
            const url = `${source}/v/film/news/feed?query=${encodeURIComponent(actor)}`; // Hypothetical URL
            const parser = new Parser();
            const sourceFeed = await parser.parseURL(url);

            sourceFeed.items.forEach(article => {
                feed.item({
                    title: article.title,
                    description: article.contentSnippet || article.description,
                    url: article.link,
                    guid: article.guid || article.link,
                    author: article.creator,
                    date: article.pubDate,
                    categories: article.categories,
                    enclosure: article.enclosure ? {url: article.enclosure.url} : undefined,
                });
            });

            const xml = feed.xml({indent: true});
            res.writeHead(200, {'Content-Type': 'application/rss+xml'});
            res.write(xml);
            res.end()
        } catch (error) {
            console.error('Error fetching or generating RSS feed:', error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
        }
    },"Get RSS Feed for Actor",
    "Generates an RSS feed with news related to a specific actor."),
    new Router("POST","/luca-app/admin/logout",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
                const controller = new adminController();
                return await controller.logout(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Logout Admin",
        "Logs out an admin user and clears the session."),
    new Router("GET","/luca-app/admin/nominatedActors",async (req,res)=>{
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
                const controller = new adminController();
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
    new Router("DELETE","/luca-app/admin/user",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
                const controller = new adminController();
                return await controller.deleteUser(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Delete User",
        "Deletes a user from the system."),
    new Router("PUT","/luca-app/admin/user",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
                const controller = new adminController();
                return await controller.updateUser(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Update User",
        "Updates the details of an existing user."),
    new Router("POST","/luca-app/admin/user",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
                const controller = new adminController();
                return await controller.addUser(req, res)
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Add User",
        "Adds a new user to the system."),
    new Router("POST","/luca-app/admin/import-csv",async (req,res)=>{
        try {
            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
                const controller = new adminController();
                return await controller.importcsv(req,res);
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    },
        "Import CSV",
        "Imports user data from a CSV file.")
];


module.exports = { internalRoutes };