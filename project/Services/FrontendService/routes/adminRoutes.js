const {RouterController,Router} = require("../../../modules/controllers/routerController");
const fs = require("fs");
const getTokenStatus = require("../../Admin/modules/protected");


const routerController = new RouterController([
    new Router("GET", "/luca-app/front/styles/authentification.css", async (req, res) => {
    fs.readFile("Frontend/styles/authentification.css", (err, data) => {
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
    })
]);

routerController.addRoute(new Router("GET", "/luca-app/front/news/RSS", async (req, res) => {
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
);

routerController.addRoute(new Router("GET", "/luca-app/front/news", async (req, res, next) => {

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
    })
)

routerController.addRoute(new Router("GET", "/luca-app/front/news/:", async (req, res, next) => {

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
        });
    }),
)


routerController.addRoute(    new Router("GET", "/luca-app/front/admin", async (req, res, next) => {

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
        });
    })
)



module.exports ={routerController}