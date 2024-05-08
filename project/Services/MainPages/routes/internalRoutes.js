const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const {feedController} = require("../controllers/feedController");
const {favoritesController} = require("../controllers/favoritesController");
const Token = require("../../Authentication/modules/token");

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
    }),
    new Router("GET", "/home", async (req, res, next) => {

        fs.readFile("Frontend/views/home.html", 'utf-8', async (err, html) => {
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
            if (!accessToken || !refreshToken) {
                res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                return res.end();
            }

            try {
                const decoded = await JWToken.validate(accessToken);
                if (!decoded) {
                    res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                    return res.end();
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
    new Router("GET", '/actvis', async (req, res) => {
        fs.readFile("Frontend/views/home_unauthenticated.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);

        });
    }),
    new Router("GET", '/notifications', async (req, res) => {
        fs.readFile("Frontend/views/announces.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);

        });
    }),
    new Router("GET", '/getnotifications', async (req, res) => {
        try {
            const controller = new feedController();
            const feedDone = await controller.getnotifications(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/announces', async (req, res) => {
        try {
            const controller = new feedController();
            const feedDone = await controller.feedAnnounces(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("POST","/send-actor-id",async (req,res)=>{
        try {
            const controller = new feedController();
            const sendId = await controller.sendId(req,res);
            return sendId;

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),

    new Router("POST","/actor-profile-info",async (req,res)=>{
        try {
            const controller = new feedController();
            const sendId = await controller.sendIdInformations(req,res);
            return sendId;

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),

    new Router("GET", '/toppicks', async (req, res) => {
        try {
            const controller = new feedController();
            const feedDone = await controller.feedTopPicks(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/todayActors', async (req, res) => {
        try {
            const controller = new feedController();
            const feedDone = await controller.feedTodayActors(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", '/commingSoon', async (req, res) => {
        try {
            const controller = new feedController();
            const feedDone = await controller.feedCommingSoon(req,res);

        } catch (error) {
            console.error("Error forgot password user", error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET", "/favorites", async (req, res, next) => {

        fs.readFile("Frontend/views/favorites.html", 'utf-8', async (err, html) => {
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
                    res.writeHead(401, {'Content-Type': 'text/html'});
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
    new Router("GET", "/actor-profile/:", async (req, res, next) => {

        fs.readFile("Frontend/views/actor-profile.html", 'utf-8', async (err, html) => {
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

            /*
            if (!accessToken) {
                res.writeHead(302, {'Location': 'http://localhost:3000/login'});
                return res.end('Authorization cookie missing or invalid');
            }

            try {
                const decoded = await JWToken.validate(accessToken);
                if (!decoded) {
                    res.writeHead(401, {'Content-Type': 'text/html'});
                    return res.end('Invalid token');
                } ///aici o sa fac si cu refresh
            */
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            // } catch (error) {
            //     console.error('Error validating token:', error);
            //     res.writeHead(500, {'Content-Type': 'text/html'});
            //     res.end('Internal server error');
            // }
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
    })
    ,
    new Router("GET","/about",async (req,res)=>{
        fs.readFile("Frontend/views/about.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    }),
    new Router("GET","/help",async (req,res)=>{
        fs.readFile("Frontend/views/help.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    }),
    new Router("GET", "/styles/home.css", async (req, res) => {
        fs.readFile("Frontend/styles/home.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", "/styles/favourites.css", async (req, res) => {
        fs.readFile("Frontend/styles/favourites.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", "/styles/about.css", async (req, res) => {
        fs.readFile("Frontend/styles/about.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", "/styles/help.css", async (req, res) => {
        fs.readFile("Frontend/styles/help.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }),
    new Router("GET", "/styles/index.css", async (req, res) => {
        fs.readFile("Frontend/styles/index.css", (err, data) => {
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
    new Router("GET", "/styles/actor-profile.css", async (req, res) => {
        fs.readFile("Frontend/styles/actor-profile.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
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


    new Router("POST","/add-favorites",async (req,res)=>{
        try {
            const controller = new favoritesController();
            return await controller.addFavorite(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),

    new Router("GET","/all-favorites",async (req,res)=>{
        try {
            const controller = new favoritesController();
            return await controller.getAllFavorites(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET","/topPicksWeek",async (req,res)=>{
        try {
            const controller = new favoritesController();
            return await controller.getTopPicks(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),

    new Router("GET","/topFavorites",async (req,res)=>{
        try {
            const controller = new favoritesController();
            return await controller.getTopFavorites(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("GET","/exploreActors",async (req,res)=>{
        try {

            const controller = new feedController();
            return await controller.exploreActorsTypes(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("DELETE","/delete-actor",async (req,res)=>{
        try {

            const controller = new favoritesController();
            return await controller.deleteFavorites(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    }),
    new Router("POST","/logout",async (req,res)=>{
        try {

            const controller = new feedController();
            return await controller.logout(req, res);
        } catch (error) {
            console.error(error);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Error");
        }
    })
];


module.exports = { internalRoutes };