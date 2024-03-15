const { Router } = require("../../../modules/controllers/routerController");
const fs = require("fs");

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
];

module.exports = { internalRoutes };