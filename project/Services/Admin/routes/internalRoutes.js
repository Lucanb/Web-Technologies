const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const Token = require("../../Authentication/modules/token");
const {adminController} = require("../../Admin/controllers/AdminController");
const Parser = require('rss-parser');
const { URL } = require('url');
const formidable = require('formidable');
const RSS = require('rss');
const getTokenStatus = require('../modules/protected')

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
    new Router("GET", "/luca-app/admin/news/RSS", async (req, res) => {
        fs.readFile("Frontend/views/newsrss.html", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        });
    })
    ,
    new Router("POST", "/luca-app/admin/addAnnounce", async (req, res) => {
        try {

            const controller = new adminController();
            return await controller.addAnnounce(req,res)
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
    ,
    new Router("GET", "/luca-app/admin/news", async (req, res, next) => {

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
            // let accessToken = null;
            // let refreshToken = null;
            // if (cookies) {
            //     const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            //         const parts = cookie.split('=');
            //         acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            //         return acc;
            //     }, {});
            //     accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
            //     refreshToken = cookieObj['refreshToken'];
            // }

            // if (!accessToken) {
            //     res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //     return res.end('Authorization cookie missing or invalid');
            // }
            //
            // try {
            //     const decoded = await JWToken.validate(accessToken);
            //     if (!decoded) {
            //         res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //         return res.end('Invalid token');
            //     } ///aici o sa fac si cu refresh
            //
            //     res.writeHead(200, {'Content-Type': 'text/html'});
            //     res.end(html);
            // } catch (error) {
            //     try {
            //         const decoded = await JWToken.validate(refreshToken);
            //         console.log(decoded)
            //         if (!decoded) {
            //             res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //             return res.end();
            //         } else {
            //             const accessToken = await Token.generateKey({
            //                 userId: decoded[0].userId,
            //                 role: decoded[0].role,
            //                 username: decoded[0].username,
            //                 fresh: true,
            //                 type: 'access'
            //             }, {
            //                 expiresIn: '1h'
            //             })
            //             console.log( accessToken)
            //             res.setHeader('Set-Cookie',
            //                 `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
            //             );
            //             res.writeHead(200, {'Content-Type': 'text/html'});
            //             res.end(html);
            //         }
            //     }catch (error)
            //     {
            //         console.error('Error validating token:', error);
            //         res.writeHead(500, {'Content-Type': 'text/html'});
            //         res.end('Internal server error');
            //     }
            // }
        });
    }),
    new Router("GET", "/luca-app/admin/users", async (req, res) => {
        try {
            const controller = new adminController();
            return await controller.getUsers(req,res)
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            const feedDone = await controller.feedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("PUT", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            return await controller.UpdateFeedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),    new Router("DELETE", '/luca-app/admin/announces', async (req, res) => {
        try {
            const controller = new adminController();
            const feedDone = await controller.deleteFeedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", "/luca-app/admin/news/:", async (req, res, next) => {

        fs.readFile("Frontend/views/newsActor.html", 'utf-8', async (err, html) => {
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
            // let accessToken = null;
            // let refreshToken = null;
            // if (cookies) {
            //     const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            //         const parts = cookie.split('=');
            //         acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            //         return acc;
            //     }, {});
            //     accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
            //     refreshToken = cookieObj['refreshToken'];
            // }
            //
            // // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // // try {
            // //     const decoded = await JWToken.validate(token);
            // //     if (!decoded) {
            // //         res.writeHead(401, {'Content-Type': 'text/html'});
            // //         return res.end('Invalid token');
            // //     }
            // if (!accessToken) {
            //     res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //     return res.end('Authorization cookie missing or invalid');
            // }
            //
            // try {
            //     const decoded = await JWToken.validate(accessToken);
            //     if (!decoded) {
            //         res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //         return res.end('Invalid token');
            //     } ///aici o sa fac si cu refresh
            //
            //     res.writeHead(200, {'Content-Type': 'text/html'});
            //     res.end(html);
            // } catch (error) {
            //     try {
            //         const decoded = await JWToken.validate(refreshToken);
            //         console.log(decoded)
            //         if (!decoded) {
            //             res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //             return res.end();
            //         } else {
            //             const accessToken = await Token.generateKey({
            //                 userId: decoded[0].userId,
            //                 role: decoded[0].role,
            //                 username: decoded[0].username,
            //                 fresh: true,
            //                 type: 'access'
            //             }, {
            //                 expiresIn: '1h'
            //             })
            //             console.log( accessToken)
            //             res.setHeader('Set-Cookie',
            //                 `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
            //             );
            //             res.writeHead(200, {'Content-Type': 'text/html'});
            //             res.end(html);
            //         }
            //     }catch (error)
            //     {
            //         console.error('Error validating token:', error);
            //         res.writeHead(500, {'Content-Type': 'text/html'});
            //         res.end('Internal server error');
            //     }
            // }
        });
    }),
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

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment);
        const actor = decodeURIComponent(pathSegments[2]);

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
    }),
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
    })
,
    new Router("GET", "/luca-app/admin/admin", async (req, res, next) => {

        fs.readFile("Frontend/views/admin.html", 'utf-8', async (err, html) => {
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
            // let accessToken = null;
            // let refreshToken = null;
            // if (cookies) {
            //     const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            //         const parts = cookie.split('=');
            //         acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            //         return acc;
            //     }, {});
            //     accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
            //     refreshToken = cookieObj['refreshToken'];
            // }

            // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // try {
            //     const decoded = await JWToken.validate(token);
            //     if (!decoded) {
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     }
            // if (!accessToken) {
            //     res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //     return res.end('Authorization cookie missing or invalid');
            // }
            //
            // try {
            //     const decoded = await JWToken.validate(accessToken);
            //     if (!decoded) {
            //         res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //         return res.end('Invalid token');
            //     } ///aici o sa fac si cu refresh
            //     if (!decoded[0].role)
            //     {
            //         res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //         return res.end('Invalid token');
            //     }
            //
            //     res.writeHead(200, {'Content-Type': 'text/html'});
            //     res.end(html);
            // } catch (error) {
            //     try {
            //         const decoded = await JWToken.validate(refreshToken);
            //         console.log(decoded)
            //         if (!decoded) {
            //             res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //             return res.end();
            //         } else {
            //             const accessToken = await Token.generateKey({
            //                 userId: decoded[0].userId,
            //                 role: decoded[0].role,
            //                 username: decoded[0].username,
            //                 fresh: true,
            //                 type: 'access'
            //             }, {
            //                 expiresIn: '1h'
            //             })
            //             console.log( accessToken)
            //             res.setHeader('Set-Cookie',
            //                 `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
            //             );
            //             res.writeHead(200, {'Content-Type': 'text/html'});
            //             res.end(html);
            //         }
            //     }catch (error)
            //     {
            //         console.error('Error validating token:', error);
            //         res.writeHead(500, {'Content-Type': 'text/html'});
            //         res.end('Internal server error');
            //     }
            // }
        });
    }),
    new Router("GET", "/luca-app/admin/styles/admin.css", async (req, res) => {
        fs.readFile("Frontend/styles/admin.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", "/luca-app/admin/styles/news.css", async (req, res) => {
        fs.readFile("Frontend/styles/news.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("POST","/luca-app/admin/logout",async (req,res)=>{
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
                const controller = new adminController();
                return await controller.logout(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
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
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
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
    }),
    new Router("DELETE","/luca-app/admin/user",async (req,res)=>{
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
                const controller = new adminController();
                return await controller.deleteUser(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("PUT","/luca-app/admin/user",async (req,res)=>{
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
                const controller = new adminController();
                return await controller.updateUser(req, res)
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("POST","/luca-app/admin/user",async (req,res)=>{
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
                const controller = new adminController();
                return await controller.addUser(req, res)
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("POST","/luca-app/admin/import-csv",async (req,res)=>{
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
                const controller = new adminController();
                return await controller.importcsv(req,res);
                // const form = new formidable.IncomingForm();
                // form.parse(req, (err, fields, files) => {
                //     if (err) {
                //         console.error(err);
                //         res.writeHead(500, {'Content-Type': 'text/plain'});
                //         res.end('An error occurred');
                //         return;
                //     }
                //
                //     console.log(files.csvFile);
                //     const csvFile = files.csvFile[0];
                //
                //     if (!csvFile) {
                //         res.writeHead(400, {'Content-Type': 'text/plain'});
                //         res.end('No CSV file was uploaded.');
                //         return;
                //     }
                //
                //     const filePath = csvFile.filepath;
                //     if (!filePath) {
                //         res.writeHead(500, {'Content-Type': 'text/plain'});
                //         res.end('File path is undefined');
                //         return;
                //     }
                //
                //     fs.readFile(filePath, 'utf8', (err, data) => {
                //         if (err) {
                //             console.error(err);
                //             res.writeHead(500, {'Content-Type': 'text/plain'});
                //             res.end('Failed to read file');
                //             return;
                //         }
                //
                //         res.writeHead(200, {'Content-Type': 'text/plain'});
                //         res.end(JSON.stringify({ message: 'File uploaded and processed' }));
                //     });
                // });
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
];


module.exports = { internalRoutes };