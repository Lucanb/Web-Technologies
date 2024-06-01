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
        });
    },
        "Get Home Page",
        "Serves the home HTML page for authenticated users.")
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
        });
    },
        "Get Diagrams Page",
        "Serves the diagrams HTML page.")
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
    },
        "Get Unauthenticated Home Page",
        "Serves the home HTML page for unauthenticated users.")
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
        });
    },
        "Get Notifications Page",
        "Serves the notifications HTML page for authenticated users.")
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
        });
    },
        "Get Favorites Page",
        "Serves the favorites HTML page for authenticated users.")
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
        });
    },
        "Get Actor Profile Page",
        "Serves the actor profile HTML page for authenticated users."
    )
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
        "Get News Page",
        "Serves the news HTML page for authenticated users.")
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
    },
        "Get About Page",
        "Serves the about HTML page."
    )
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
    },
        "Get Help Page",
        "Serves the help HTML page."
    )
)

module.exports ={routerController}