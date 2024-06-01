const {RouterController,Router} = require("../app_modules/controllers/routerController");
const fs = require("fs");
const {getTokenStatus,getAdminTokenStatus} = require("../modules/protected");
const path = require('path')
const dirPath = path.resolve(__dirname, '../Frontend');

const routerController = new RouterController([
new Router("GET", "/luca-app/front/news/RSS", async (req, res) => {
            const filePath = path.join(dirPath, 'views/newsrss.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    return res.end('404 Not Found');
                }
                res.writeHead(200, {'Content-Type' : 'text/html'});
                res.write(data);
                res.end();
            });
        },
    "Get News RSS",
    "Serves the news RSS HTML page.")
 ]);

routerController.addRoute(new Router("GET", "/luca-app/front/news", async (req, res, next) => {
    const filePath = path.join(dirPath, 'views/news.html');
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
        });
    },
        "Get News",
        "Serves the news HTML page."
    )
)

routerController.addRoute(new Router("GET", "/luca-app/front/news/:", async (req, res, next) => {
    const filePath = path.join(dirPath, 'views/newsActor.html');
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
        });
    },
    "Get News for Actor",
    "Serves the news HTML page for a specific actor.")
)


routerController.addRoute(    new Router("GET", "/luca-app/front/admin", async (req, res, next) => {
    const filePath = path.join(dirPath, 'views/admin.html');
        fs.readFile(filePath, 'utf-8', async (err, html) => {
            if (err) {
                console.error('Error reading file:', err);
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }

            const cookies = req.headers.cookie;
            const tokenStatus = await getAdminTokenStatus(cookies)
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
        });
    },
        "Get Admin Page",
        "Serves the admin HTML page."
    )
)



module.exports ={routerController}