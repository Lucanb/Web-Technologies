const http = require('http');

const server = http.createServer((req, res) => {

    console.log(`URL accesat: ${req.url}`);
    if (req.url === '/luca-app/service2/hello') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from Service 2');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('merge');
    }
});

server.listen(3002, () => {
    console.log('Service 2 is running on http://localhost:3002');
});
