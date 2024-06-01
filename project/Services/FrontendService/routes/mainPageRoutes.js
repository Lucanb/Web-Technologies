const {RouterController,Router} = require("../app_modules/controllers/routerController");
const fs = require("fs");
const {getTokenStatus,getAdminTokenStatus} = require("../modules/protected");
const path = require('path')
const dirPath = path.resolve(__dirname, '../Frontend');

const routerController = new RouterController([new Router("GET", "/luca-app/front/altaRuta", async (req, res) => {
    const filePath = path.join(dirPath, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end('404 Not Found');
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    });
})
]);

routerController.addRoute(
    new Router("GET", "/luca-app/front/home", async (req, res, next) => {
        const filePath = path.join(dirPath, 'views/home.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/diagrams.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/home_unauthenticated.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
        const filePath = path.join(dirPath, 'views/announces.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/favorites.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/actor-profile.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/news.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
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
                    res.writeHead(302, {'Location': 'http://localhost:5000/luca-app/front/login'});
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
        const filePath = path.join(dirPath, 'views/about.html');
        fs.readFile(filePath,(err, data)=>{
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
        const filePath = path.join(dirPath, 'views/help.html');
        fs.readFile(filePath,(err, data)=>{
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