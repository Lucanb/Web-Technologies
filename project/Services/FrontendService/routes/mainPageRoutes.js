const {RouterController,Router} = require("../../../modules/controllers/routerController");
const fs = require("fs");
const getTokenStatus = require("../../Admin/modules/protected");


const routerController = new RouterController([new Router("GET", "/luca-app/front/altaRuta", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/home.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/favourites.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/about.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/help.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/index.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/news.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/actor-profile.css", async (req, res) => {
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
    new Router("GET", "/luca-app/front/styles/admin.css", async (req, res) => {
        fs.readFile("Frontend/styles/admin.css", (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/css'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    })
]);

routerController.addRoute(
    new Router("GET", "/luca-app/front/home", async (req, res, next) => {

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
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=.luca-app`
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
            // if (!accessToken || !refreshToken) {
            //     res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //     return res.end();
            // }
            //
            // try {
            //     const decoded = await JWToken.validate(accessToken);
            //     if (!decoded) {
            //         res.writeHead(302, {'Location': 'http://localhost:3000/login'});
            //         return res.end();
            //     }
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
    })
)

routerController.addRoute(
    new Router("GET", "/luca-app/front/diagrams/:", async (req, res, next) => {

        fs.readFile("Frontend/views/diagrams.html", 'utf-8', async (err, html) => {
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
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
            // const cookies = req.headers.cookie;
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
            // res.writeHead(200, {'Content-Type': 'text/html'});
            // res.end(html);
            // } catch (error) {
            //     console.error('Error validating token:', error);
            //     res.writeHead(500, {'Content-Type': 'text/html'});
            //     res.end('Internal server error');
            // }
        });
    })
);

routerController.addRoute(
    new Router("GET", '/luca-app/front/actvis', async (req, res) => {
        fs.readFile("Frontend/views/home_unauthenticated.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);

        });
    })
);

routerController.addRoute(
    new Router("GET", '/luca-app/front/notifications', async (req, res) => {
        fs.readFile("Frontend/views/announces.html", 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://luca-app:5000/luca-app/front/login'});
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
            // res.writeHead(200, {'Content-Type': 'text/html'});
            // res.end(html);

        });
    })
);

routerController.addRoute(
    new Router("GET", "/luca-app/front/favorites", async (req, res, next) => {

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
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
            // const cookies = req.headers.cookie;
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
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     } ///aici o sa fac si cu refresh
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
    })
);

routerController.addRoute(
    new Router("GET", "/luca-app/front/actor-profile/:", async (req, res, next) => {

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
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
            // const cookies = req.headers.cookie;
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
            // res.writeHead(200, {'Content-Type': 'text/html'});
            // res.end(html);
            // } catch (error) {
            //     console.error('Error validating token:', error);
            //     res.writeHead(500, {'Content-Type': 'text/html'});
            //     res.end('Internal server error');
            // }
        });
    })
)

routerController.addRoute(
    new Router("GET", "/luca-app/front/news", async (req, res, next) => {

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

            // const cookies = req.headers.cookie;
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
            }else{
                if (tokenStatus.newAccessToken) {
                    res.setHeader('Set-Cookie',
                        `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                    );
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            }
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
    })
)

routerController.addRoute(
    new Router("GET","/luca-app/front/about",async (req,res)=>{
        fs.readFile("Frontend/views/about.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
)

routerController.addRoute(
    new Router("GET","/luca-app/front/help",async (req,res)=>{
        fs.readFile("Frontend/views/help.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
    })
)

module.exports ={routerController}