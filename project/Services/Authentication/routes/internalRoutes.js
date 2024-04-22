const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");

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
    new Router("GET", "/news", async (req, res, next) => {

        fs.readFile("Frontend/views/news.html", 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            console.log('header : ',JSON.stringify(req.headers))
            // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            //     return res.end('Authorization header missing or invalid');
            // }

            const cookies = req.headers.cookie;
            let accessToken = null;
            if (cookies) {
                const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                    const parts = cookie.split('=');
                    acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                    return acc;
                }, {});
                accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
            }

            // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // try {
            //     const decoded = await JWToken.validate(token);
            //     if (!decoded) {
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     }
            if (!accessToken) {
                res.writeHead(401, {'Content-Type': 'text/html'});
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
                console.error('Error validating token:', error);
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('Internal server error');
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
            console.log('header : ',JSON.stringify(req.headers))
            // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            //     res.writeHead(401, {'Content-Type': 'text/html'});
            //     return res.end('Authorization header missing or invalid');
            // }

            const cookies = req.headers.cookie;
            let accessToken = null;
            if (cookies) {
                const cookieObj = cookies.split(';').reduce((acc, cookie) => {
                    const parts = cookie.split('=');
                    acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
                    return acc;
                }, {});
                accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
            }

            // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
            // try {
            //     const decoded = await JWToken.validate(token);
            //     if (!decoded) {
            //         res.writeHead(401, {'Content-Type': 'text/html'});
            //         return res.end('Invalid token');
            //     }
            if (!accessToken) {
                res.writeHead(401, {'Content-Type': 'text/html'});
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
                console.error('Error validating token:', error);
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('Internal server error');
            }
        });
    })
    ,
    new Router("GET","/about",async (req,res)=>{
        fs.readFile("Frontend/views/about.html",(err, data)=>{
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                // console.log(err)
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
                // console.log(err)
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        })
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
    })
];


module.exports = { internalRoutes };