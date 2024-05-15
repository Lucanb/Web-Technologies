const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");
const JWToken = require("../modules/token");
const getTokenStatus = require("../../Admin/modules/protected");

const internalRoutes = [
    // new Router("GET", "/news", async (req, res, next) => {
    //
    //     fs.readFile("Frontend/views/news.html", 'utf-8', async (err, html) => {
    //         if (err) {
    //             console.error('Error reading file:', err);
    //             res.writeHead(404, {'Content-Type': 'text/html'});
    //             return res.end('404 Not Found');
    //         }
    //         console.log('header : ',JSON.stringify(req.headers))
    //         // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    //         //     res.writeHead(401, {'Content-Type': 'text/html'});
    //         //     return res.end('Authorization header missing or invalid');
    //         // }
    //         const cookies = req.headers.cookie;
    //         const tokenStatus = await getTokenStatus(cookies)
    //         if (!tokenStatus.valid){
    //             if(tokenStatus.message === 'Internal server error')
    //             {
    //                 res.writeHead(500, {'Content-Type': 'text/html'});
    //                 res.end(tokenStatus.message)
    //             }else{
    //                 res.writeHead(302, {'Location': 'http://localhost:3000/login'});
    //                 res.end(tokenStatus.message);
    //             }
    //         }else{
    //             if (tokenStatus.newAccessToken) {
    //                 res.setHeader('Set-Cookie',
    //                     `accessToken=${tokenStatus.newAccessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
    //                 );
    //             }
    //             res.writeHead(200, {'Content-Type': 'text/html'});
    //             res.end(html);
    //         }
    //
    //         // const cookies = req.headers.cookie;
    //         // let accessToken = null;
    //         // if (cookies) {
    //         //     const cookieObj = cookies.split(';').reduce((acc, cookie) => {
    //         //         const parts = cookie.split('=');
    //         //         acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
    //         //         return acc;
    //         //     }, {});
    //         //     accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
    //         // }
    //
    //         // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
    //         // try {
    //         //     const decoded = await JWToken.validate(token);
    //         //     if (!decoded) {
    //         //         res.writeHead(401, {'Content-Type': 'text/html'});
    //         //         return res.end('Invalid token');
    //         //     }
    //         // if (!accessToken) {
    //         //     res.writeHead(401, {'Content-Type': 'text/html'});
    //         //     return res.end('Authorization cookie missing or invalid');
    //         // }
    //         //
    //         // try {
    //         //     const decoded = await JWToken.validate(accessToken);
    //         //     if (!decoded) {
    //         //         res.writeHead(401, {'Content-Type': 'text/html'});
    //         //         return res.end('Invalid token');
    //         //     } ///aici o sa fac si cu refresh
    //         //
    //         //     res.writeHead(200, {'Content-Type': 'text/html'});
    //         //     res.end(html);
    //         // } catch (error) {
    //         //     console.error('Error validating token:', error);
    //         //     res.writeHead(500, {'Content-Type': 'text/html'});
    //         //     res.end('Internal server error');
    //         // }
    //     });
    // }),
    // new Router("GET", "/admin", async (req, res, next) => {
    //
    //     fs.readFile("Frontend/views/admin.html", 'utf-8', async (err, html) => {
    //         if (err) {
    //             console.error('Error reading file:', err);
    //             res.writeHead(404, {'Content-Type': 'text/html'});
    //             return res.end('404 Not Found');
    //         }
    //         console.log('header : ',JSON.stringify(req.headers))
    //         // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    //         //     res.writeHead(401, {'Content-Type': 'text/html'});
    //         //     return res.end('Authorization header missing or invalid');
    //         // }
    //
    //         const cookies = req.headers.cookie;
    //         let accessToken = null;
    //         if (cookies) {
    //             const cookieObj = cookies.split(';').reduce((acc, cookie) => {
    //                 const parts = cookie.split('=');
    //                 acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
    //                 return acc;
    //             }, {});
    //             accessToken = cookieObj['accessToken'];  // Assuming the token is stored under the key 'accessToken'
    //         }
    //
    //         // const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
    //         // try {
    //         //     const decoded = await JWToken.validate(token);
    //         //     if (!decoded) {
    //         //         res.writeHead(401, {'Content-Type': 'text/html'});
    //         //         return res.end('Invalid token');
    //         //     }
    //         if (!accessToken) {
    //             res.writeHead(401, {'Content-Type': 'text/html'});
    //             return res.end('Authorization cookie missing or invalid');
    //         }
    //
    //         try {
    //             const decoded = await JWToken.validate(accessToken);
    //             if (!decoded) {
    //                 res.writeHead(401, {'Content-Type': 'text/html'});
    //                 return res.end('Invalid token');
    //             } ///aici o sa fac si cu refresh
    //
    //             res.writeHead(200, {'Content-Type': 'text/html'});
    //             res.end(html);
    //         } catch (error) {
    //             console.error('Error validating token:', error);
    //             res.writeHead(500, {'Content-Type': 'text/html'});
    //             res.end('Internal server error');
    //         }
    //     });
    // })
];


module.exports = { internalRoutes };