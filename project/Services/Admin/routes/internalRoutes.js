const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const Token = require("../../Authentication/modules/token");
const {adminController} = require("../../Admin/controllers/AdminController");
const Parser = require('rss-parser');

const internalRoutes = [
    new Router("GET", "/altaRuta", async (req, res) => {
        fs.readFile("Frontend/index.html", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        });
    })
    ,
    new Router("GET", "/news", async (req, res, next) => {

        fs.readFile("Frontend/views/news.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            //     return res.end('Authorization header missing or invalid');
            // }

            const cookies = req.headers.cookie;
            let accessToken = null;
            let refreshToken = null;
            if (cookies) {
                const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                    const parts = cookie.split('=');
                    acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                    return acc;
                }, {});
                accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
                refreshToken = cookieObj['refreshToken'];
            }

            // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // try {
            //     const decoded = await JWToken.validate(token);
            //     if (!decoded) {
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     }
            if (!accessToken) {
                res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                return res.end('Authorization cookie missing or invalid');
            }

            try {
                const decoded = await JWToken.validate(accessToken);
                if (!decoded) {
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    return res.end('Invalid token');
                } ///aici o sa fac si cu refresh

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            } catch (error) {
                try {
                    const decoded = await JWToken.validate(refreshToken);
                    console.log(decoded)
                    if (!decoded) {
                        res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                        return res.end();
                    } else {
                        const accessToken = await Token.generateKey({
                            userId: decoded[0].userId,
                            role: decoded[0].role,
                            username: decoded[0].username,
                            fresh: true,
                            type: 'access'
                        }, {
                            expiresIn: '1h'
                        })
                        console.log( accessToken)
                        res.setHeader('Set-Cookie',
                            `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                        );
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(html);
                    }
                }catch (error)
                {
                    console.error('Error validating token:', error);
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end('Internal server error');
                }
            }
        });
    }),
    new Router("GET",'/get-news', async (req, res) => {
        const url = "https://variety.com/v/film/news/feed/";
        const parser = new Parser();
        try {
            const feed = await parser.parseURL(url);
            const newsItems = feed.items.map(item => ({
                title: item.title,
                link: item.link,
                contentSnippet: item.contentSnippet || '',
                imageUrl: item.enclosure ? item.enclosure.url : '../img/default-image.jpg'
            }));

            res.writeHead(200, {'Content-Type': 'application/json'}); // Set the content type to JSON
            res.end(JSON.stringify(newsItems)); // Convert the array to a JSON string before sending
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('Internal server error');
        }
    })
    ,
    new Router("GET", "/admin", async (req, res, next) => {

        fs.readFile("Frontend/views/admin.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            //     return res.end('Authorization header missing or invalid');
            // }

            const cookies = req.headers.cookie;
            let accessToken = null;
            let refreshToken = null;
            if (cookies) {
                const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                    const parts = cookie.split('=');
                    acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                    return acc;
                }, {});
                accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
                refreshToken = cookieObj['refreshToken'];
            }

            // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // try {
            //     const decoded = await JWToken.validate(token);
            //     if (!decoded) {
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     }
            if (!accessToken) {
                res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                return res.end('Authorization cookie missing or invalid');
            }

            try {
                const decoded = await JWToken.validate(accessToken);
                if (!decoded) {
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    return res.end('Invalid token');
                } ///aici o sa fac si cu refresh
                if (!decoded[0].role)
                {
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    return res.end('Invalid token');
                }

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            } catch (error) {
                try {
                    const decoded = await JWToken.validate(refreshToken);
                    console.log(decoded)
                    if (!decoded) {
                        res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                        return res.end();
                    } else {
                        const accessToken = await Token.generateKey({
                            userId: decoded[0].userId,
                            role: decoded[0].role,
                            username: decoded[0].username,
                            fresh: true,
                            type: 'access'
                        }, {
                            expiresIn: '1h'
                        })
                        console.log( accessToken)
                        res.setHeader('Set-Cookie',
                            `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                        );
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(html);
                    }
                }catch (error)
                {
                    console.error('Error validating token:', error);
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end('Internal server error');
                }
            }
        });
    }),
    new Router("GET", "/styles/admin.css", async (req, res) => {
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
    new Router("GET", "/styles/news.css", async (req, res) => {
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
    new Router("POST","/logout",async (req,res)=>{
        try {

            const controller = new adminController();
            return await controller.logout(req,res)
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
];


module.exports = { internalRoutes };