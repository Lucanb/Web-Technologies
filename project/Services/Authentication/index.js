const { config } = require("./configuration/configApplication");
const http = require("http");
const { routerController } = require("./routes/authRoutes");

const index = http.createServer((req, res) => {
    routerController.handleRequest(req, res);
});

const port = config.PORT;
index.listen(port, () => {
    console.log(`Serverul ascultă pe portul ${port}`);
});
